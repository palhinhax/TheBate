"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type GiveawayWithDetails = {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  prize: string;
  status: string;
  startDate: Date;
  endDate: Date;
  winnerId: string | null;
  winner: {
    username: string | null;
    name: string | null;
    email: string;
  } | null;
  _count: {
    entries: number;
  };
};

export function GiveawayListItem({ giveaway }: { giveaway: GiveawayWithDetails }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectWinner = async () => {
    if (!confirm("Are you sure you want to select a winner? This cannot be undone.")) {
      return;
    }

    setIsSelecting(true);
    setError(null);

    try {
      const response = await fetch("/api/giveaway/select-winner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId: giveaway.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to select winner");
      }

      alert(
        `Winner selected: ${data.winner.name || data.winner.username} (${data.winner.email})`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSelecting(false);
    }
  };

  const title = typeof giveaway.title === "object" ? giveaway.title.en : giveaway.title;
  const now = new Date();
  const isActive = giveaway.status === "ACTIVE" && now >= giveaway.startDate && now <= giveaway.endDate;
  const hasEnded = now > giveaway.endDate;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {giveaway.status === "DRAFT" && <Badge variant="secondary">Draft</Badge>}
            {isActive && <Badge className="bg-green-500">Active</Badge>}
            {hasEnded && giveaway.status === "ACTIVE" && <Badge variant="destructive">Ended</Badge>}
            {giveaway.status === "WINNER_SELECTED" && (
              <Badge className="bg-amber-500">Winner Selected</Badge>
            )}
          </div>

          <p className="mb-4 text-sm text-muted-foreground">Prize: {giveaway.prize}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(giveaway.startDate).toLocaleDateString()} -{" "}
                {new Date(giveaway.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{giveaway._count.entries} entries</span>
            </div>
          </div>

          {giveaway.winner && (
            <div className="mt-4 rounded-lg border border-amber-500 bg-amber-50 p-3 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-amber-900 dark:text-amber-100">
                  Winner: {giveaway.winner.name || giveaway.winner.username}
                </span>
                <span className="text-amber-700 dark:text-amber-300">
                  ({giveaway.winner.email})
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
              {error}
            </div>
          )}
        </div>

        <div className="ml-4">
          {!giveaway.winnerId && (giveaway.status === "ACTIVE" || giveaway.status === "ENDED") && (
            <Button onClick={handleSelectWinner} disabled={isSelecting} variant="outline">
              {isSelecting ? "Selecting..." : "Select Winner"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
