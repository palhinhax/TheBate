import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { giveawayId } = await request.json();

    if (!giveawayId) {
      return NextResponse.json({ error: "Giveaway ID required" }, { status: 400 });
    }

    // Check if giveaway exists and is active
    const giveaway = await prisma.giveaway.findUnique({
      where: { id: giveawayId },
    });

    if (!giveaway) {
      return NextResponse.json({ error: "Giveaway not found" }, { status: 404 });
    }

    if (giveaway.status !== "ACTIVE") {
      return NextResponse.json({ error: "Giveaway is not active" }, { status: 400 });
    }

    const now = new Date();
    if (now < giveaway.startDate || now > giveaway.endDate) {
      return NextResponse.json({ error: "Giveaway is not currently running" }, { status: 400 });
    }

    // Check if user already entered
    const existingEntry = await prisma.giveawayEntry.findUnique({
      where: {
        giveawayId_userId: {
          giveawayId,
          userId: session.user.id,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json({ error: "Already entered" }, { status: 400 });
    }

    // Check if user has voted (requirement for entry)
    const hasVoted = await prisma.topicVote.count({
      where: { userId: session.user.id },
    });

    // Check if user has commented (optional, tracked but not required)
    const hasCommented = await prisma.comment.count({
      where: { userId: session.user.id },
    });

    // Create entry
    const entry = await prisma.giveawayEntry.create({
      data: {
        giveawayId,
        userId: session.user.id,
        hasVoted: hasVoted > 0,
        hasCommented: hasCommented > 0,
      },
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        hasVoted: entry.hasVoted,
        hasCommented: entry.hasCommented,
      },
    });
  } catch (error) {
    console.error("Giveaway entry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
