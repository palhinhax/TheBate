import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.isOwner && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, prize, startDate, endDate } = body;

    if (!title || !description || !prize || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    // Create giveaway
    const giveaway = await prisma.giveaway.create({
      data: {
        title,
        description,
        prize,
        startDate: start,
        endDate: end,
        status: "ACTIVE", // Start as active immediately
      },
    });

    return NextResponse.json({
      success: true,
      giveaway: {
        id: giveaway.id,
        title: giveaway.title,
        status: giveaway.status,
      },
    });
  } catch (error) {
    console.error("Giveaway creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
