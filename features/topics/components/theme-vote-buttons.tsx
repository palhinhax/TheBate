"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthModal } from "@/components/auth-modal";
import { useTranslations } from "@/lib/use-translations";
import {
  requireAuthForInteractions,
  storeAnonymousVote,
  getAnonymousVote,
  removeAnonymousVote,
  generateAnonymousId,
} from "@/lib/auth-config";

type ThemeVote = "SIM" | "NAO" | "DEPENDE";

type ThemeVoteButtonsProps = {
  topicSlug: string;
  topicId: string;
  userVote: ThemeVote | null;
  disabled?: boolean;
};

export default function ThemeVoteButtons({
  topicSlug,
  topicId,
  userVote,
  disabled = false,
}: ThemeVoteButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const { t } = useTranslations();
  const [isVoting, setIsVoting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentVote, setCurrentVote] = useState<ThemeVote | null>(userVote);
  const requireAuth = requireAuthForInteractions();

  // Load anonymous vote from localStorage if not authenticated
  useEffect(() => {
    if (!session?.user && !requireAuth) {
      const storedVote = getAnonymousVote(topicId);
      if (storedVote && typeof storedVote === "string") {
        setCurrentVote(storedVote as ThemeVote);
      }
    } else {
      setCurrentVote(userVote);
    }
  }, [session, topicId, userVote, requireAuth]);

  const handleVote = async (vote: ThemeVote) => {
    // Check if auth is required
    if (requireAuth && !session?.user) {
      setShowAuthModal(true);
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      const isRemovingVote = currentVote === vote;

      // If clicking the same vote, remove it
      if (isRemovingVote) {
        const response = await fetch(`/api/topics/${topicSlug}/vote`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            anonymousId: !session?.user ? generateAnonymousId() : undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || t("topics.vote_remove_error", "Error removing vote"));
        }

        // Update local state
        setCurrentVote(null);

        // For anonymous users, remove from localStorage
        if (!session?.user) {
          removeAnonymousVote(topicId);
        }
      } else {
        // Otherwise, vote or change vote
        const response = await fetch(`/api/topics/${topicSlug}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vote,
            anonymousId: !session?.user ? generateAnonymousId() : undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || t("topics.vote_error", "Error voting"));
        }

        // Update local state
        setCurrentVote(vote);

        // For anonymous users, store in localStorage
        if (!session?.user) {
          storeAnonymousVote(topicId, vote);
        }
      }

      // Show success message for anonymous votes
      if (!session?.user) {
        toast({
          title: t("topics.vote_registered", "Vote registered"),
          description: t(
            "topics.vote_registered_desc",
            "Your vote has been recorded successfully!"
          ),
        });
      }

      router.refresh();
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => handleVote("SIM")}
          disabled={isVoting || disabled}
          variant={currentVote === "SIM" ? "default" : "outline"}
          className="flex-1"
          size="lg"
        >
          {currentVote === "SIM" ? "✓ " : ""}
          {t("topics.vote_yes", "Yes")}
        </Button>
        <Button
          onClick={() => handleVote("NAO")}
          disabled={isVoting || disabled}
          variant={currentVote === "NAO" ? "default" : "outline"}
          className="flex-1"
          size="lg"
        >
          {currentVote === "NAO" ? "✓ " : ""}
          {t("topics.vote_no", "No")}
        </Button>
        <Button
          onClick={() => handleVote("DEPENDE")}
          disabled={isVoting || disabled}
          variant={currentVote === "DEPENDE" ? "default" : "outline"}
          className="flex-1"
          size="lg"
        >
          {currentVote === "DEPENDE" ? "✓ " : ""}
          {t("topics.vote_depends", "It Depends")}
        </Button>
      </div>
      {requireAuth && <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />}
    </>
  );
}
