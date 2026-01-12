"use client";

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function GiveawayEntryButton({
  giveawayId,
  hasVoted,
}: {
  giveawayId: string;
  hasVoted: boolean;
}) {
  const [isEntering, setIsEntering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEnter = async () => {
    setIsEntering(true);
    setError(null);

    try {
      const response = await fetch("/api/giveaway/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enter giveaway");
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsEntering(false);
    }
  };

  return (
    <div>
      <Button
        size="lg"
        onClick={handleEnter}
        disabled={isEntering}
        className="bg-amber-500 hover:bg-amber-600"
      >
        <Gift className="mr-2 h-5 w-5" />
        {isEntering ? "Entering..." : "Enter Giveaway"}
      </Button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!hasVoted && (
        <p className="mt-4 text-sm text-muted-foreground">
          💡 After entering, vote in any debate to complete your entry!
        </p>
      )}
    </div>
  );
}
