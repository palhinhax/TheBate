"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  ThumbsUp,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserData = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    tags: string[];
    createdAt: string;
    _count: {
      comments: number;
      topicVotes: number;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    side: "AFAVOR" | "CONTRA" | null;
    createdAt: string;
    votes: number;
    topic: {
      slug: string;
      title: string;
    };
  }>;
  stats: {
    totalTopics: number;
    totalComments: number;
    totalVotesReceived: number;
  };
};

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"topics" | "comments">("topics");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Utilizador não encontrado</CardTitle>
            <CardDescription>
              O utilizador @{username} não existe ou foi removido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Voltar à página inicial</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-5xl px-4 py-8">
        {/* User Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.username.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold">
                  {user.name || user.username}
                </h1>
                <p className="mb-4 text-lg text-muted-foreground">
                  @{user.username}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("pt-PT", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {user.stats.totalTopics}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tema{user.stats.totalTopics !== 1 ? "s" : ""} criado
                  {user.stats.totalTopics !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {user.stats.totalComments}
                </div>
                <div className="text-sm text-muted-foreground">
                  Argumento{user.stats.totalComments !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="col-span-2 text-center sm:col-span-1">
                <div className="text-2xl font-bold text-primary">
                  {user.stats.totalVotesReceived}
                </div>
                <div className="text-sm text-muted-foreground">
                  Voto{user.stats.totalVotesReceived !== 1 ? "s" : ""} recebido
                  {user.stats.totalVotesReceived !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === "topics" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "topics" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("topics")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Temas ({user.topics.length})
            </Button>
            <Button
              variant={activeTab === "comments" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "comments" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("comments")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Argumentos ({user.comments.length})
            </Button>
          </div>
        </div>

        {/* Topics Tab */}
        {activeTab === "topics" && (
          <div className="space-y-4">
            {user.topics.length > 0 ? (
              user.topics.map((topic) => (
                <Link key={topic.id} href={`/t/${topic.slug}`}>
                  <Card className="transition-all hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(topic.createdAt).toLocaleDateString(
                            "pt-PT",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {topic._count.comments} argumento
                          {topic._count.comments !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {topic._count.topicVotes} voto
                          {topic._count.topicVotes !== 1 ? "s" : ""}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    {topic.tags.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {topic.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    Nenhum tema criado ainda.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {user.comments.length > 0 ? (
              user.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription className="mb-2 flex items-center gap-2">
                          Argumento em{" "}
                          <Link
                            href={`/t/${comment.topic.slug}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {comment.topic.title}
                          </Link>
                        </CardDescription>
                      </div>
                      {comment.side && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            comment.side === "AFAVOR"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                          }`}
                        >
                          {comment.side === "AFAVOR"
                            ? "👍 A Favor"
                            : "👎 Contra"}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 whitespace-pre-wrap text-sm">
                      {comment.content.length > 300
                        ? comment.content.substring(0, 300) + "..."
                        : comment.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(comment.createdAt).toLocaleDateString(
                          "pt-PT",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.votes} voto{comment.votes !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/t/${comment.topic.slug}`}>
                        <Button variant="outline" size="sm">
                          Ver discussão completa
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UserIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    Nenhum argumento publicado ainda.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
