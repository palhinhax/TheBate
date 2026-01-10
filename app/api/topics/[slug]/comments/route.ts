import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "top";
    const side = searchParams.get("side"); // AFAVOR, CONTRA, or null for all
    const optionId = searchParams.get("optionId"); // For MULTI_CHOICE topics
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(
      parseInt(searchParams.get("perPage") || "50"),
      100
    );

    const skip = (page - 1) * perPage;

    // First, find the topic
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: { id: true, status: true, type: true },
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
      optionId?: string | null;
    }

    const where: CommentWhere = {
      topicId: topic.id,
      parentId: null, // Only top-level comments
      status: "ACTIVE" as const,
    };

    // Add filters based on topic type
    if (topic.type === "YES_NO") {
      // For YES_NO topics, filter by side if specified
      if (side === "AFAVOR" || side === "CONTRA") {
        where.side = side;
      }
    } else if (topic.type === "MULTI_CHOICE") {
      // For MULTI_CHOICE topics, filter by option if specified
      if (optionId) {
        where.optionId = optionId;
      }
    }

    // For "top" sort, we need to order by vote count (calculated field)
    // This requires a raw query for optimal performance with large datasets
    const orderBy =
      sort === "new"
        ? { createdAt: "desc" as const }
        : { createdAt: "desc" as const }; // Will sort by votes in the query below

    let comments;

    if (sort === "top") {
      // Build dynamic SQL conditions
      let sideCondition = Prisma.empty;
      if (topic.type === "YES_NO" && (side === "AFAVOR" || side === "CONTRA")) {
        sideCondition = Prisma.sql`AND c.side = ${side}`;
      }

      let optionCondition = Prisma.empty;
      if (topic.type === "MULTI_CHOICE" && optionId) {
        optionCondition = Prisma.sql`AND c."optionId" = ${optionId}`;
      }

      // Get comment IDs sorted by vote count
      const results = await prisma.$queryRaw<{ id: string }[]>`
        SELECT 
          c.*,
          COUNT(v.id)::int as "voteCount"
        FROM "Comment" c
        LEFT JOIN "Vote" v ON v."commentId" = c.id
        WHERE c."topicId" = ${topic.id}
          AND c."parentId" IS NULL
          AND c.status = 'ACTIVE'
          ${sideCondition}
          ${optionCondition}
        GROUP BY c.id
        ORDER BY "voteCount" DESC, c."createdAt" DESC
        LIMIT ${perPage}
        OFFSET ${skip}
      `;

      // Fetch full relations for each comment
      const commentIds = results.map((r) => r.id);
      comments = await prisma.comment.findMany({
        where: { id: { in: commentIds } },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          option: {
            select: {
              id: true,
              label: true,
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
      });
    } else {
      comments = await prisma.comment.findMany({
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
          option: {
            select: {
              id: true,
              label: true,
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
      });
    }

    // Count total comments for pagination
    const total = await prisma.comment.count({ where });

    return NextResponse.json({
      data: comments,
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
