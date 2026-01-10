import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import CommentItem from "./comment-item";

type CommentsListProps = {
  topicSlug: string;
  sort: "top" | "new";
  side?: "AFAVOR" | "CONTRA" | null;
  optionId?: string;
};

async function getComments(
  topicSlug: string,
  sort: "top" | "new",
  side?: "AFAVOR" | "CONTRA" | null,
  optionId?: string
) {
  // First, find the topic
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    select: { id: true, type: true },
  });

  if (!topic) {
    return { comments: [], topicId: null, topicType: null };
  }

  // Get current user session
  const session = await auth();
  const userId = session?.user?.id;

  const where: {
    topicId: string;
    parentId: null;
    status: "ACTIVE";
    side?: "AFAVOR" | "CONTRA";
    optionId?: string | null;
  } = {
    topicId: topic.id,
    parentId: null,
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

  // For "top" sort, we use raw SQL for efficiency with vote count
  // For "new" sort, we use standard Prisma query
  let comments: unknown[];

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
      LIMIT 50
    `;

    // Get the full comment data with relations
    const commentIds = results.map((r) => r.id);
    if (commentIds.length === 0) {
      comments = [];
    } else {
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
          votes: userId
            ? {
                where: { userId },
                select: { value: true },
              }
            : false,
          _count: {
            select: {
              votes: true,
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
              votes: userId
                ? {
                    where: { userId },
                    select: { value: true },
                  }
                : false,
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
    }
  } else {
    comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" as const },
      take: 50,
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
        votes: userId
          ? {
              where: { userId },
              select: { value: true },
            }
          : false,
        _count: {
          select: {
            votes: true,
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
            votes: userId
              ? {
                  where: { userId },
                  select: { value: true },
                }
              : false,
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
      },
    });
  }

  return { comments, topicId: topic.id, topicType: topic.type };
}

export default async function CommentsList({
  topicSlug,
  sort,
  side,
  optionId,
}: CommentsListProps) {
  const { comments, topicId, topicType } = await getComments(topicSlug, sort, side, optionId);

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {side
            ? `Ainda não há argumentos ${side === "AFAVOR" ? "a favor" : "contra"}.`
            : optionId
              ? "Ainda não há argumentos para esta opção."
              : "Ainda não há argumentos. Seja o primeiro a argumentar!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(comments as Array<{ id: string; [key: string]: unknown }>).map((comment) => (
        <CommentItem key={comment.id} comment={comment as never} topicId={topicId!} />
      ))}
    </div>
  );
}
