import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get pagination params from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;
    const reported = searchParams.get("reported") === "true";

    // Build where clause
    const where = reported ? { reportCount: { gt: 0 } } : {};

    // Get all topics (no language filter for admin)
    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
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
        skip: reported ? undefined : skip,
        take: reported ? undefined : limit,
      }),
      prisma.topic.count({ where }),
    ]);

    return NextResponse.json({
      topics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin topics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
