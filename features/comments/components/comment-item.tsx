"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import NewCommentForm from "./new-comment-form";

type CommentUser = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

type Reply = {
  id: string;
  content: string;
  side: "AFAVOR" | "CONTRA" | null;
  createdAt: Date;
  user: CommentUser;
  votes?: { value: number }[];
  _count?: { votes: number };
};

type Comment = {
  id: string;
  content: string;
  side: "AFAVOR" | "CONTRA" | null;
  createdAt: Date;
  user: CommentUser;
  votes?: { value: number }[];
  replies?: Reply[];
  _count?: { votes: number };
};

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
  topicId: string;
};

export default function CommentItem({
  comment,
  isReply = false,
  topicId,
}: CommentItemProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Check if user has voted (quality vote)
  const hasVoted = Boolean(comment.votes?.length);

  const handleVote = async () => {
    // Calculate score from vote count
    const score = comment._count?.votes ?? 0;
    if (!session?.user) {
      toast({
        title: "Entre para votar",
        description: "Precisa de iniciar sessão para votar.",
        variant: "destructive",
      });
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: 1 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao votar");
      }

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const getSideBadge = () => {
    if (!comment.side) return null;

    const badgeClasses =
      comment.side === "AFAVOR"
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClasses}`}
      >
        <span>{comment.side === "AFAVOR" ? "👍" : "👎"}</span>
        {comment.side === "AFAVOR" ? "A Favor" : "Contra"}
      </span>
    );
  };

  return (
    <div className={isReply ? "ml-8 mt-4" : ""}>
      <div className="flex gap-3">
        {/* Quality Voting */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleVote}
            disabled={isVoting || !session?.user}
            className={`rounded p-1.5 transition-colors hover:bg-muted disabled:opacity-50 ${
              hasVoted ? "text-primary" : "text-muted-foreground"
            }`}
            title="Bom argumento"
          >
            <ThumbsUp className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {comment._count?.votes || 0}
          </span>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/u/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              @{comment.user.username}
            </Link>
            {getSideBadge()}
            <span>•</span>
            <span>
              {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm">{comment.content}</p>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4">
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                Responder
              </button>
            )}
            {session?.user?.id === comment.user.id && (
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
                Editar
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <NewCommentForm
                topicId={topicId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  topicId={topicId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
