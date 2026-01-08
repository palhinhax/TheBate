"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Eye, EyeOff, Lock } from "lucide-react";

type Topic = {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  createdBy: {
    username: string;
    name: string | null;
  };
  _count: {
    comments: number;
    topicVotes: number;
  };
};

type Comment = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  user: {
    username: string;
    name: string | null;
  };
  topic: {
    title: string;
    slug: string;
  };
  _count: {
    replies: number;
    votes: number;
  };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"topics" | "comments">("topics");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    loadData();
  }, [status, session, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [topicsRes, commentsRes] = await Promise.all([
        fetch("/api/admin/topics"),
        fetch("/api/admin/comments"),
      ]);

      if (topicsRes.ok) setTopics(await topicsRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este tópico?")) return;

    try {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTopics(topics.filter((t) => t.id !== id));
        toast({ title: "Tópico deletado com sucesso" });
      }
    } catch {
      toast({
        title: "Erro ao deletar tópico",
        variant: "destructive",
      });
    }
  };

  const updateTopicStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setTopics(
          topics.map((t) => (t.id === id ? { ...t, status } : t))
        );
        toast({ title: "Status atualizado" });
      }
    } catch {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este comentário?")) return;

    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
        toast({ title: "Comentário deletado com sucesso" });
      }
    } catch {
      toast({
        title: "Erro ao deletar comentário",
        variant: "destructive",
      });
    }
  };

  const updateCommentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setComments(
          comments.map((c) => (c.id === id ? { ...c, status } : c))
        );
        toast({ title: "Status atualizado" });
      }
    } catch {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Painel de Administração</h1>

      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-4 py-2 ${
            activeTab === "topics"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Tópicos ({topics.length})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 ${
            activeTab === "comments"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Comentários ({comments.length})
        </button>
      </div>

      {activeTab === "topics" && (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link
                    href={`/t/${topic.slug}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {topic.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Por {topic.createdBy.name || topic.createdBy.username} •{" "}
                    {new Date(topic.createdAt).toLocaleDateString("pt-PT")} •{" "}
                    {topic._count.comments} comentários •{" "}
                    {topic._count.topicVotes} votos
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        topic.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : topic.status === "HIDDEN"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {topic.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTopicStatus(topic.id, "HIDDEN")}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  )}
                  {topic.status === "HIDDEN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTopicStatus(topic.id, "ACTIVE")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTopicStatus(topic.id, "LOCKED")}
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm">
                    {comment.content.length > 200
                      ? comment.content.substring(0, 200) + "..."
                      : comment.content}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Por {comment.user.name || comment.user.username} •{" "}
                    {new Date(comment.createdAt).toLocaleDateString("pt-PT")} •
                    em{" "}
                    <Link
                      href={`/t/${comment.topic.slug}`}
                      className="hover:underline"
                    >
                      {comment.topic.title}
                    </Link>
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        comment.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : comment.status === "HIDDEN"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {comment.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCommentStatus(comment.id, "HIDDEN")}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  )}
                  {comment.status === "HIDDEN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCommentStatus(comment.id, "ACTIVE")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
