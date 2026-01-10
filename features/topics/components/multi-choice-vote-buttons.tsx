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
  description?: string | null;
};

type MultiChoiceVoteButtonsProps = {
  topicSlug: string;
  options: TopicOption[];
  userVotes: string[]; // Array of option IDs user has voted for
  allowMultipleVotes: boolean;
  maxChoices: number;
  disabled?: boolean;
};

export default function MultiChoiceVoteButtons({
  topicSlug,
  options,
  userVotes,
  allowMultipleVotes,
  maxChoices,
  disabled = false,
}: MultiChoiceVoteButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userVotes);

  const handleOptionToggle = (optionId: string) => {
    if (!session?.user) {
      toast({
        title: "Entre para votar",
        description: "Precisa de iniciar sessão para votar.",
        variant: "destructive",
      });
      return;
    }

    if (disabled || isVoting) return;

    setSelectedOptions((prev) => {
      const isSelected = prev.includes(optionId);

      if (isSelected) {
        // Deselect
        return prev.filter((id) => id !== optionId);
      } else {
        // Select
        if (!allowMultipleVotes) {
          // Single choice: replace selection
          return [optionId];
        } else {
          // Multiple choice: add if under max
          if (prev.length >= maxChoices) {
            toast({
              title: "Limite atingido",
              description: `Pode escolher no máximo ${maxChoices} opç${maxChoices === 1 ? "ão" : "ões"}`,
              variant: "destructive",
            });
            return prev;
          }
          return [...prev, optionId];
        }
      }
    });
  };

  const handleSubmitVote = async () => {
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
        description: "Escolha pelo menos uma opção para votar.",
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
        title: "Voto registado",
        description: "O teu voto foi registado com sucesso!",
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
    if (!session?.user || isVoting) return;

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

  const hasChanges =
    JSON.stringify([...selectedOptions].sort()) !==
    JSON.stringify([...userVotes].sort());

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleOptionToggle(option.id)}
              disabled={isVoting || disabled}
              className={`relative rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary"
                  : "border-border bg-card hover:border-primary/50"
              } ${isVoting || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <p className="text-sm text-muted-foreground">
          {allowMultipleVotes
            ? `Pode escolher até ${maxChoices} opç${maxChoices === 1 ? "ão" : "ões"}`
            : "Escolha uma opção"}
          {selectedOptions.length > 0 &&
            ` (${selectedOptions.length} selecionada${selectedOptions.length !== 1 ? "s" : ""})`}
        </p>
        <div className="flex gap-2">
          {userVotes.length > 0 && (
            <Button
              onClick={handleRemoveVote}
              disabled={isVoting}
              variant="outline"
              size="sm"
            >
              Remover voto
            </Button>
          )}
          <Button
            onClick={handleSubmitVote}
            disabled={isVoting || !hasChanges || selectedOptions.length === 0}
            size="sm"
          >
            {isVoting ? "A votar..." : hasChanges ? "Confirmar voto" : "Votar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
