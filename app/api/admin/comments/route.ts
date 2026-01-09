import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reported = searchParams.get("reported") === "true";

    const where: Prisma.CommentWhereInput = reported
      ? { reportCount: { gt: 0 } }
      : {};

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
        topic: {
          select: {
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            replies: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Admin comments fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
