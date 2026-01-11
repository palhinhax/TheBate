"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commentSchema,
  replySchema,
  type CommentFormData,
  type ReplyFormData,
} from "@/features/comments/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AuthModal } from "@/components/auth-modal";

type TopicOption = {
  id: string;
  label: string;
  description?: string | null;
};

type NewCommentFormProps = {
  topicId: string;
  topicType?: "YES_NO" | "MULTI_CHOICE";
  options?: TopicOption[];
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function NewCommentForm({
  topicId,
  topicType = "YES_NO",
  options = [],
  parentId,
  onSuccess,
  onCancel,
}: NewCommentFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isReply = !!parentId;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CommentFormData | ReplyFormData>({
    resolver: zodResolver(isReply ? replySchema : commentSchema),
    defaultValues: {
      topicId,
      parentId,
    },
  });

  const content = watch("content") || "";
  const selectedSide = watch("side" as never) as unknown;
  const selectedOptionId = watch("optionId" as never) as unknown;

  const onSubmit = async (data: CommentFormData | ReplyFormData) => {
    // Check authentication before submitting
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar comentário");
      }

      toast({
        title: isReply ? "Resposta publicada!" : "Argumento publicado!",
        description: isReply
          ? "A tua resposta foi adicionada com sucesso."
          : "O teu argumento foi adicionado com sucesso.",
      });
      reset();
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Side selection for YES_NO topics (only for top-level comments) */}
      {!isReply && topicType === "YES_NO" && (
        <div>
          <Label>Posição</Label>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setValue("side" as never, "AFAVOR" as never)}
              className={`flex-1 rounded-lg border px-4 py-3 text-center transition-all ${
                selectedSide === "AFAVOR"
                  ? "border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600 dark:bg-green-950 dark:text-green-400"
                  : "border-border bg-background hover:border-green-600/50"
              }`}
            >
              <div className="text-lg">👍</div>
              <div className="text-sm font-medium">A Favor</div>
            </button>
            <button
              type="button"
              onClick={() => setValue("side" as never, "CONTRA" as never)}
              className={`flex-1 rounded-lg border px-4 py-3 text-center transition-all ${
                selectedSide === "CONTRA"
                  ? "border-red-600 bg-red-50 text-red-700 ring-2 ring-red-600 dark:bg-red-950 dark:text-red-400"
                  : "border-border bg-background hover:border-red-600/50"
              }`}
            >
              <div className="text-lg">👎</div>
              <div className="text-sm font-medium">Contra</div>
            </button>
          </div>
          {"side" in errors && errors.side && (
            <p className="mt-1 text-sm text-destructive">{errors.side.message as string}</p>
          )}
        </div>
      )}

      {/* Option selection for MULTI_CHOICE topics (only for top-level comments) */}
      {!isReply && topicType === "MULTI_CHOICE" && options.length > 0 && (
        <div>
          <Label htmlFor="optionId">Opção associada (opcional)</Label>
          <select
            id="optionId"
            {...register("optionId" as never)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Nenhuma opção específica</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {"optionId" in errors && errors.optionId && (
            <p className="mt-1 text-sm text-destructive">{errors.optionId.message as string}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="content">
          {isReply ? "Escreve a tua resposta" : "Escreve o teu argumento"}
        </Label>
        <textarea
          id="content"
          {...register("content")}
          placeholder={
            parentId
              ? "Escreve a tua resposta..."
              : "Desenvolve o teu argumento aqui..."
          }
          className="mt-1 min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          {!isReply && (
            <p
              className={`ml-auto text-xs ${
                content.length < 20
                  ? "text-destructive"
                  : content.length > 800
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {content.length}/800 caracteres
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "A publicar..."
            : parentId
              ? "Responder"
              : "Publicar Argumento"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
    <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
