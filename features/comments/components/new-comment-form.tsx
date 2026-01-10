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

type NewCommentFormProps = {
  topicId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function NewCommentForm({
  topicId,
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
  } = useForm<CommentFormData | ReplyFormData>({
    resolver: zodResolver(isReply ? replySchema : commentSchema),
    defaultValues: {
      topicId,
      parentId,
    },
  });

  const content = watch("content") || "";

  const onSubmit = async (data: CommentFormData | ReplyFormData) => {
    // Check auth before submitting
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
          ? "Sua resposta foi adicionada com sucesso."
          : "Seu argumento foi adicionado com sucesso.",
      });
      reset();
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="content">
            {isReply ? "Escreva sua resposta" : "Escreva seu argumento"}
          </Label>
          <textarea
            id="content"
            {...register("content")}
            placeholder={
              parentId
                ? "Escreva sua resposta..."
                : "Desenvolva seu argumento aqui..."
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
              ? "Publicando..."
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
