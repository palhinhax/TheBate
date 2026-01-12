import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.isOwner && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { giveawayId } = await request.json();

    if (!giveawayId) {
      return NextResponse.json({ error: "Giveaway ID required" }, { status: 400 });
    }

    // Check if giveaway exists and can have a winner selected
    const giveaway = await prisma.giveaway.findUnique({
      where: { id: giveawayId },
      include: {
        entries: {
          where: {
            hasVoted: true, // Only eligible entries (users who voted)
          },
        },
      },
    });

    if (!giveaway) {
      return NextResponse.json({ error: "Giveaway not found" }, { status: 404 });
    }

    if (giveaway.status !== "ACTIVE" && giveaway.status !== "ENDED") {
      return NextResponse.json(
        { error: "Giveaway is not ready for winner selection" },
        { status: 400 }
      );
    }

    if (giveaway.winnerId) {
      return NextResponse.json({ error: "Winner already selected" }, { status: 400 });
    }

    const eligibleEntries = giveaway.entries;

    if (eligibleEntries.length === 0) {
      return NextResponse.json({ error: "No eligible entries found" }, { status: 400 });
    }

    // Randomly select a winner
    const randomIndex = Math.floor(Math.random() * eligibleEntries.length);
    const winnerEntry = eligibleEntries[randomIndex];

    // Update giveaway with winner
    const updatedGiveaway = await prisma.giveaway.update({
      where: { id: giveawayId },
      data: {
        winnerId: winnerEntry.userId,
        status: "WINNER_SELECTED",
      },
      include: {
        winner: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      winner: {
        id: updatedGiveaway.winner?.id,
        name: updatedGiveaway.winner?.name,
        username: updatedGiveaway.winner?.username,
        email: updatedGiveaway.winner?.email,
      },
      totalEligibleEntries: eligibleEntries.length,
    });
  } catch (error) {
    console.error("Winner selection error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
