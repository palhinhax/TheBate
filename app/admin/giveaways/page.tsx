import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateGiveawayForm } from "./create-giveaway-form";
import { GiveawayListItem } from "./giveaway-list-item";
import { Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Giveaways - Admin - TheBatee",
  description: "Admin panel for managing giveaways",
};

async function getAllGiveaways() {
  const giveaways = await prisma.giveaway.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      winner: {
        select: {
          username: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          entries: true,
        },
      },
    },
  });

  return giveaways;
}

export default async function AdminGiveawaysPage() {
  const session = await auth();

  if (!session?.user?.isOwner && session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const giveaways = await getAllGiveaways();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Giveaways</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage giveaways to increase user engagement
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>

      {/* Create New Giveaway */}
      <div className="mb-12 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Create New Giveaway</h2>
        <CreateGiveawayForm />
      </div>

      {/* Existing Giveaways */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Existing Giveaways</h2>
        {giveaways.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No giveaways yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first giveaway to start attracting users
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {giveaways.map((giveaway) => (
              <GiveawayListItem key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
