import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentsList from "@/features/comments/components/comments-list";
import NewCommentForm from "@/features/comments/components/new-comment-form";

type Props = {
  params: { slug: string };
  searchParams: { sort?: string };
};

async function getTopic(slug: string) {
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return topic;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopic(params.slug);

  if (!topic) {
    return {
      title: "Tema não encontrado",
    };
  }

  return {
    title: `${topic.title} - Thebate`,
    description: topic.description.substring(0, 160),
    openGraph: {
      title: topic.title,
      description: topic.description.substring(0, 160),
      type: "article",
      publishedTime: topic.createdAt.toISOString(),
      authors: [topic.createdBy.username],
      tags: topic.tags,
    },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const session = await auth();
  const topic = await getTopic(params.slug);

  if (!topic) {
    notFound();
  }

  // Check if user can see this topic
  if (topic.status !== "ACTIVE") {
    const userRole = session?.user?.role;
    if (!userRole || (userRole !== "MOD" && userRole !== "ADMIN")) {
      notFound();
    }
  }

  const sort = searchParams.sort || "top";

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl">
            Thebate
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/new">
                  <Button size="sm">Novo Tema</Button>
                </Link>
                <Link href={`/u/${session.user.username}`}>
                  <Button variant="ghost" size="sm">
                    {session.user.name || session.user.username}
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">Entrar para Comentar</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Topic Header */}
        <div className="mb-8">
          {topic.status !== "ACTIVE" && (
            <div className="mb-4 rounded-lg border border-yellow-500 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Este tema está {topic.status === "HIDDEN" ? "oculto" : "bloqueado"}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {topic.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${tag}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20"
              >
                {tag}
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground whitespace-pre-wrap mb-4">
            {topic.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={`/u/${topic.createdBy.username}`}
              className="hover:underline"
            >
              @{topic.createdBy.username}
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(topic.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {topic._count.comments} comentário{topic._count.comments !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* New Comment Form */}
        {topic.status !== "LOCKED" && (
          <div className="mb-8">
            {session?.user ? (
              <NewCommentForm topicId={topic.id} />
            ) : (
              <div className="rounded-lg border bg-muted/50 px-6 py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Entre para participar da discussão
                </p>
                <Link href={`/auth/login?callbackUrl=/t/${topic.slug}`}>
                  <Button>Entrar</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {topic.status === "LOCKED" && (
          <div className="mb-8 rounded-lg border border-yellow-500 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800">
            Este tema está bloqueado. Não é possível adicionar novos comentários.
          </div>
        )}

        {/* Comments Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Comentários</h2>
            <div className="flex gap-2">
              <Link href={`/t/${topic.slug}?sort=top`}>
                <Button variant={sort === "top" ? "default" : "ghost"} size="sm">
                  Top
                </Button>
              </Link>
              <Link href={`/t/${topic.slug}?sort=new`}>
                <Button variant={sort === "new" ? "default" : "ghost"} size="sm">
                  Novos
                </Button>
              </Link>
            </div>
          </div>

          <CommentsList topicSlug={topic.slug} sort={sort as "top" | "new"} />
        </div>
      </main>
    </div>
  );
}
