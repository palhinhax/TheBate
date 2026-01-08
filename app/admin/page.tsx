"use client";

import { useEffect, useState, useCallback } from "react";
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

type User = {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: string;
  isOwner: boolean;
  createdAt: string;
  _count: {
    topics: number;
    comments: number;
    votes: number;
    topicVotes: number;
  };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"topics" | "comments" | "users">(
    "topics"
  );
  const [topics, setTopics] = useState<Topic[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [topicsRes, commentsRes, usersRes] = await Promise.all([
        fetch("/api/admin/topics"),
        fetch("/api/admin/comments"),
        fetch("/api/admin/users"),
      ]);

      if (topicsRes.ok) setTopics(await topicsRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || !session.user.isOwner) {
      router.push("/");
      return;
    }

    loadData();
  }, [status, session, router, loadData]);

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
        setTopics(topics.map((t) => (t.id === id ? { ...t, status } : t)));
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
        setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
        toast({ title: "Status atualizado" });
      }
    } catch {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este usuário? Todos os seus conteúdos serão removidos."
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        toast({ title: "Usuário deletado com sucesso" });
      } else {
        const error = await res.json();
        toast({
          title: "Erro ao deletar usuário",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro ao deletar usuário",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
        toast({ title: "Role atualizada" });
      }
    } catch {
      toast({
        title: "Erro ao atualizar role",
        variant: "destructive",
      });
    }
  };

  const toggleOwnerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOwner: !currentStatus }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
        toast({
          title: !currentStatus
            ? "Usuário promovido a Owner"
            : "Status de Owner removido",
        });
      } else {
        const error = await res.json();
        toast({
          title: "Erro",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro ao atualizar status de owner",
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

  if (!session?.user || !session.user.isOwner) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Painel do Owner</h1>

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
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 ${
            activeTab === "users"
              ? "border-b-2 border-primary font-semibold"
              : "text-muted-foreground"
          }`}
        >
          Usuários ({users.length})
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

      {activeTab === "users" && (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {user.name || user.username}
                    </h3>
                    {user.isOwner && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                        OWNER
                      </span>
                    )}
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "MOD"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    @{user.username} • {user.email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Membro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                  </p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>{user._count.topics} tópicos</span>
                    <span>{user._count.comments} comentários</span>
                    <span>{user._count.topicVotes} votos em tópicos</span>
                    <span>{user._count.votes} votos em comentários</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="rounded border px-2 py-1 text-sm"
                      disabled={user.id === session.user.id}
                    >
                      <option value="USER">USER</option>
                      <option value="MOD">MOD</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <Button
                      size="sm"
                      variant={user.isOwner ? "default" : "outline"}
                      onClick={() => toggleOwnerStatus(user.id, user.isOwner)}
                      disabled={user.id === session.user.id}
                      title={
                        user.isOwner ? "Remover Owner" : "Promover a Owner"
                      }
                    >
                      👑
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUser(user.id)}
                    disabled={user.id === session.user.id}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
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
