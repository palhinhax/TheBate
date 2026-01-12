"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateGiveawayForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const giveaway = {
      title: {
        en: formData.get("title_en") as string,
        pt: formData.get("title_pt") as string,
        es: formData.get("title_es") as string,
        fr: formData.get("title_fr") as string,
        de: formData.get("title_de") as string,
      },
      description: {
        en: formData.get("description_en") as string,
        pt: formData.get("description_pt") as string,
        es: formData.get("description_es") as string,
        fr: formData.get("description_fr") as string,
        de: formData.get("description_de") as string,
      },
      prize: formData.get("prize") as string,
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: new Date(formData.get("endDate") as string).toISOString(),
    };

    try {
      const response = await fetch("/api/admin/giveaway/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giveaway),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create giveaway");
      }

      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title (Multilingual) */}
      <div className="space-y-4">
        <Label>Title (Multilingual)</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input name="title_en" placeholder="English" required />
          </div>
          <div>
            <Input name="title_pt" placeholder="Português" required />
          </div>
          <div>
            <Input name="title_es" placeholder="Español" required />
          </div>
          <div>
            <Input name="title_fr" placeholder="Français" required />
          </div>
          <div>
            <Input name="title_de" placeholder="Deutsch" required />
          </div>
        </div>
      </div>

      {/* Description (Multilingual) */}
      <div className="space-y-4">
        <Label>Description (Multilingual)</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Textarea name="description_en" placeholder="English" rows={2} required />
          </div>
          <div>
            <Textarea name="description_pt" placeholder="Português" rows={2} required />
          </div>
          <div>
            <Textarea name="description_es" placeholder="Español" rows={2} required />
          </div>
          <div>
            <Textarea name="description_fr" placeholder="Français" rows={2} required />
          </div>
          <div>
            <Textarea name="description_de" placeholder="Deutsch" rows={2} required />
          </div>
        </div>
      </div>

      {/* Prize */}
      <div>
        <Label htmlFor="prize">Prize</Label>
        <Input
          id="prize"
          name="prize"
          placeholder="e.g., €50 Amazon Gift Card"
          defaultValue="€50 Amazon Gift Card"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            min={today}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="datetime-local" min={today} required />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Giveaway"}
      </Button>
    </form>
  );
}
