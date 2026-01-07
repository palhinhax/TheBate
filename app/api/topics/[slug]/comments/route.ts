import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "top";
    const side = searchParams.get("side"); // AFAVOR, CONTRA, or null for all
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(
      parseInt(searchParams.get("perPage") || "50"),
      100
    );

    const skip = (page - 1) * perPage;

    // First, find the topic
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: { id: true, status: true },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    interface CommentWhere {
      topicId: string;
      parentId: null;
      status: "ACTIVE";
      side?: "AFAVOR" | "CONTRA";
    }

    const where: CommentWhere = {
      topicId: topic.id,
      parentId: null, // Only top-level comments
      status: "ACTIVE" as const,
    };

    // Add side filter if specified
    if (side === "AFAVOR" || side === "CONTRA") {
      where.side = side;
    }

    const orderBy =
      sort === "new"
        ? { createdAt: "desc" as const }
        : [{ score: "desc" as const }, { createdAt: "desc" as const }];

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          replies: {
            where: { status: "ACTIVE" as const },
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
          _count: {
            select: {
              votes: true,
              replies: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}
