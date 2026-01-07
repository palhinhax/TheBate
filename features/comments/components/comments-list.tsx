import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import CommentItem from "./comment-item";

type CommentsListProps = {
  topicSlug: string;
  sort: "top" | "new";
  side?: "AFAVOR" | "CONTRA" | null;
};

async function getComments(
  topicSlug: string,
  sort: "top" | "new",
  side?: "AFAVOR" | "CONTRA" | null
) {
  // First, find the topic
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    select: { id: true },
  });

  if (!topic) {
    return { comments: [], topicId: null };
  }

  // Get current user session
  const session = await auth();
  const userId = session?.user?.id;

  const orderBy =
    sort === "new"
      ? { createdAt: "desc" as const }
      : [{ score: "desc" as const }, { createdAt: "desc" as const }];

  const where: any = {
    topicId: topic.id,
    parentId: null,
    status: "ACTIVE" as const,
  };

  // Add side filter if specified
  if (side === "AFAVOR" || side === "CONTRA") {
    where.side = side;
  }

  const comments = await prisma.comment.findMany({
    where,
    orderBy,
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
      votes: userId
        ? {
            where: { userId },
            select: { value: true },
          }
        : false,
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
        },
      },
    },
  });

  return { comments, topicId: topic.id };
}

export default async function CommentsList({
  topicSlug,
  sort,
  side,
}: CommentsListProps) {
  const { comments, topicId } = await getComments(topicSlug, sort, side);

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {side
            ? `Ainda não há argumentos ${side === "AFAVOR" ? "a favor" : "contra"}.`
            : "Ainda não há argumentos. Seja o primeiro a argumentar!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} topicId={topicId!} />
      ))}
    </div>
  );
}
