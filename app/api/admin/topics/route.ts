import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const topics = await prisma.topic.findMany({
      include: {
        createdBy: {
          select: {
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            topicVotes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Admin topics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
