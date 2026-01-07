import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentsList from "@/features/comments/components/comments-list";
import NewCommentForm from "@/features/comments/components/new-comment-form";
import ThemeVoteButtons from "@/features/topics/components/theme-vote-buttons";
import ThemeVoteResults from "@/features/topics/components/theme-vote-results";
import { AdContainer } from "@/components/ad-container";

type Props = {
  params: { slug: string };
  searchParams: { sort?: string; side?: string };
};

async function getTopic(slug: string, userId?: string) {
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

  if (!topic) return null;

  // Get vote statistics
  const voteStats = await prisma.topicVote.groupBy({
    by: ["vote"],
    where: { topicId: topic.id },
    _count: true,
  });

  const voteCounts = {
    SIM: 0,
    NAO: 0,
    DEPENDE: 0,
    total: 0,
  };

  voteStats.forEach((stat) => {
    voteCounts[stat.vote] = stat._count;
    voteCounts.total += stat._count;
  });

  // Get user's vote if authenticated
  let userVote = null;
  if (userId) {
    const vote = await prisma.topicVote.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: topic.id,
        },
      },
      select: { vote: true },
    });
    userVote = vote?.vote || null;
  }

  return {
    ...topic,
    voteStats: voteCounts,
    userVote,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopic(params.slug);

  if (!topic) {
    return {
      title: "Tema não encontrado",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

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
      url: `${baseUrl}/t/${topic.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description.substring(0, 160),
    },
    alternates: {
      canonical: `${baseUrl}/t/${topic.slug}`,
    },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const session = await auth();
  const topic = await getTopic(params.slug, session?.user?.id);

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
  const side = searchParams.side as "AFAVOR" | "CONTRA" | undefined;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: topic.title,
    text: topic.description,
    datePublished: topic.createdAt.toISOString(),
    dateModified: topic.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: topic.createdBy.name || topic.createdBy.username,
      url: `${baseUrl}/u/${topic.createdBy.username}`,
    },
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: topic._count.comments,
    },
    keywords: topic.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold">
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

        <main className="container mx-auto max-w-4xl px-4 py-8">
          {/* Topic Header */}
          <div className="mb-8">
            {topic.status !== "ACTIVE" && (
              <div className="mb-4 rounded-lg border border-yellow-500 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                Este tema está{" "}
                {topic.status === "HIDDEN" ? "oculto" : "bloqueado"}
              </div>
            )}

            <h1 className="mb-4 text-3xl font-bold">{topic.title}</h1>

            <div className="mb-4 flex flex-wrap gap-2">
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

            <p className="mb-4 whitespace-pre-wrap text-muted-foreground">
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
                {topic._count.comments} comentário
                {topic._count.comments !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Theme Voting Section */}
          {topic.status !== "LOCKED" && (
            <div className="mb-8 rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Vota no tema</h2>
              <div className="mb-6">
                <ThemeVoteButtons
                  topicSlug={topic.slug}
                  userVote={topic.userVote}
                  disabled={topic.status === "LOCKED"}
                />
              </div>
              <ThemeVoteResults voteStats={topic.voteStats} />
            </div>
          )}

          {/* New Comment Form */}
          {topic.status !== "LOCKED" && (
            <div className="mb-8">
              {session?.user ? (
                <>
                  <h2 className="mb-4 text-xl font-semibold">
                    Adicionar argumento
                  </h2>
                  <NewCommentForm topicId={topic.id} />
                </>
              ) : (
                <div className="rounded-lg border bg-muted/50 px-6 py-8 text-center">
                  <p className="mb-4 text-muted-foreground">
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
              Este tema está bloqueado. Não é possível adicionar novos
              argumentos.
            </div>
          )}

          {/* Advertisement - Between content and comments */}
          <AdContainer />

          {/* Comments Section */}
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold">Argumentos</h2>
              <div className="flex flex-wrap gap-2">
                {/* Sort buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/t/${topic.slug}?sort=top${side ? `&side=${side}` : ""}`}
                  >
                    <Button
                      variant={sort === "top" ? "default" : "ghost"}
                      size="sm"
                    >
                      Top
                    </Button>
                  </Link>
                  <Link
                    href={`/t/${topic.slug}?sort=new${side ? `&side=${side}` : ""}`}
                  >
                    <Button
                      variant={sort === "new" ? "default" : "ghost"}
                      size="sm"
                    >
                      Novos
                    </Button>
                  </Link>
                </div>
                {/* Side filter buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/t/${topic.slug}?sort=${sort}`}
                  >
                    <Button
                      variant={!side ? "default" : "ghost"}
                      size="sm"
                    >
                      Todos
                    </Button>
                  </Link>
                  <Link
                    href={`/t/${topic.slug}?sort=${sort}&side=AFAVOR`}
                  >
                    <Button
                      variant={side === "AFAVOR" ? "default" : "ghost"}
                      size="sm"
                    >
                      👍 A Favor
                    </Button>
                  </Link>
                  <Link
                    href={`/t/${topic.slug}?sort=${sort}&side=CONTRA`}
                  >
                    <Button
                      variant={side === "CONTRA" ? "default" : "ghost"}
                      size="sm"
                    >
                      👎 Contra
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <CommentsList 
              topicSlug={topic.slug} 
              sort={sort as "top" | "new"}
              side={side}
            />
          </div>
        </main>
      </div>
    </>
  );
}
