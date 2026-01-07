"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type ThemeVote = "SIM" | "NAO" | "DEPENDE";

type ThemeVoteButtonsProps = {
  topicSlug: string;
  userVote: ThemeVote | null;
  disabled?: boolean;
};

export default function ThemeVoteButtons({
  topicSlug,
  userVote,
  disabled = false,
}: ThemeVoteButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (vote: ThemeVote) => {
    if (!session?.user) {
      toast({
        title: "Entre para votar",
        description: "Você precisa estar logado para votar.",
        variant: "destructive",
      });
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      // If clicking the same vote, remove it
      if (userVote === vote) {
        const response = await fetch(`/api/topics/${topicSlug}/vote`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erro ao remover voto");
        }
      } else {
        // Otherwise, vote or change vote
        const response = await fetch(`/api/topics/${topicSlug}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erro ao votar");
        }
      }

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button
        onClick={() => handleVote("SIM")}
        disabled={isVoting || disabled}
        variant={userVote === "SIM" ? "default" : "outline"}
        className="flex-1"
        size="lg"
      >
        {userVote === "SIM" ? "✓ " : ""}Sim
      </Button>
      <Button
        onClick={() => handleVote("NAO")}
        disabled={isVoting || disabled}
        variant={userVote === "NAO" ? "default" : "outline"}
        className="flex-1"
        size="lg"
      >
        {userVote === "NAO" ? "✓ " : ""}Não
      </Button>
      <Button
        onClick={() => handleVote("DEPENDE")}
        disabled={isVoting || disabled}
        variant={userVote === "DEPENDE" ? "default" : "outline"}
        className="flex-1"
        size="lg"
      >
        {userVote === "DEPENDE" ? "✓ " : ""}Depende
      </Button>
    </div>
  );
}
