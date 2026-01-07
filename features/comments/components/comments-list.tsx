import { prisma } from "@/lib/prisma";
import CommentItem from "./comment-item";

type CommentsListProps = {
  topicSlug: string;
  sort: "top" | "new";
};

async function getComments(topicSlug: string, sort: "top" | "new") {
  // First, find the topic
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    select: { id: true },
  });

  if (!topic) {
    return { comments: [], topicId: null };
  }

  const orderBy = sort === "new"
    ? { createdAt: "desc" as const }
    : [{ score: "desc" as const }, { createdAt: "desc" as const }];

  const comments = await prisma.comment.findMany({
    where: {
      topicId: topic.id,
      parentId: null,
      status: "ACTIVE",
    },
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
      replies: {
        where: { status: "ACTIVE" },
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
        },
      },
    },
  });

  return { comments, topicId: topic.id };
}

export default async function CommentsList({ topicSlug, sort }: CommentsListProps) {
  const { comments, topicId } = await getComments(topicSlug, sort);

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Ainda não há comentários. Seja o primeiro a comentar!
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
