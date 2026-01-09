"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Check } from "lucide-react";

type TopicOption = {
  id: string;
  label: string;
  description: string | null;
  order: number;
};

type MultiChoiceVoteButtonsProps = {
  topicSlug: string;
  options: TopicOption[];
  userVoteOptions: string[];
  allowMultipleVotes: boolean;
  maxChoices: number;
  disabled?: boolean;
};

export default function MultiChoiceVoteButtons({
  topicSlug,
  options,
  userVoteOptions,
  allowMultipleVotes,
  maxChoices,
  disabled = false,
}: MultiChoiceVoteButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(userVoteOptions);

  const handleOptionToggle = (optionId: string) => {
    if (!allowMultipleVotes) {
      // Single choice mode
      setSelectedOptions([optionId]);
    } else {
      // Multiple choice mode
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else {
        if (selectedOptions.length >= maxChoices) {
          toast({
            title: "Limite atingido",
            description: `Você pode selecionar no máximo ${maxChoices} opções`,
            variant: "destructive",
          });
          return;
        }
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleVote = async () => {
    if (!session?.user) {
      toast({
        title: "Entre para votar",
        description: "Precisa de iniciar sessão para votar.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOptions.length === 0) {
      toast({
        title: "Selecione uma opção",
        description: "Você deve selecionar pelo menos uma opção para votar.",
        variant: "destructive",
      });
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/topics/${topicSlug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds: selectedOptions }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao votar");
      }

      toast({
        title: "Voto registado!",
        description: "O seu voto foi registado com sucesso.",
      });
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleRemoveVote = async () => {
    if (!session?.user) return;

    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/topics/${topicSlug}/vote`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao remover voto");
      }

      setSelectedOptions([]);
      toast({
        title: "Voto removido",
        description: "O seu voto foi removido com sucesso.",
      });
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="rounded-lg border bg-muted/50 px-6 py-8 text-center">
        <p className="mb-4 text-muted-foreground">
          Entre para votar neste tema
        </p>
        <Link href={`/auth/login?callbackUrl=/t/${topicSlug}`}>
          <Button>Entrar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleOptionToggle(option.id)}
              disabled={isVoting || disabled}
              className={`group relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              } ${isVoting || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{option.label}</div>
                {option.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={handleVote}
          disabled={isVoting || disabled || selectedOptions.length === 0}
          className="flex-1"
          size="lg"
        >
          {isVoting
            ? "A votar..."
            : selectedOptions.length === userVoteOptions.length &&
                JSON.stringify([...selectedOptions].sort()) ===
                  JSON.stringify([...userVoteOptions].sort())
              ? "✓ Votado"
              : "Votar"}
        </Button>
        {userVoteOptions.length > 0 && (
          <Button
            onClick={handleRemoveVote}
            disabled={isVoting || disabled}
            variant="outline"
            size="lg"
          >
            Remover voto
          </Button>
        )}
      </div>

      {allowMultipleVotes && (
        <p className="text-center text-sm text-muted-foreground">
          Você pode selecionar até {maxChoices} opção{maxChoices > 1 ? "ões" : ""}
        </p>
      )}
    </div>
  );
}
