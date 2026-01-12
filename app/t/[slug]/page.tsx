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
import MultiChoiceVoteButtons from "@/features/topics/components/multi-choice-vote-buttons";
import MultiChoiceVoteResults from "@/features/topics/components/multi-choice-vote-results";
import { AdContainer } from "@/components/ad-container";
import { ReportTopicButton } from "@/features/topics/components/report-topic-button";
import { ShareButton } from "@/components/share-button";
import NextTopicNavigation from "@/features/topics/components/next-topic-navigation";

type Props = {
  params: { slug: string };
  searchParams: { sort?: string; side?: string; optionId?: string };
};

async function getTopicData(slug: string, userId?: string) {
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
      options: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!topic) return null;

  if (topic.type === "YES_NO") {
    // Get vote statistics for YES_NO topics
    const voteStats = await prisma.topicVote.groupBy({
      by: ["vote"],
      where: { topicId: topic.id, optionId: null },
      _count: true,
    });

    const voteCounts = {
      SIM: 0,
      NAO: 0,
      DEPENDE: 0,
      total: 0,
    };

    voteStats.forEach((stat) => {
      if (stat.vote) {
        voteCounts[stat.vote] = stat._count;
        voteCounts.total += stat._count;
      }
    });

    // Get user's vote if authenticated
    let userVote = null;
    if (userId) {
      const vote = await prisma.topicVote.findFirst({
        where: {
          userId,
          topicId: topic.id,
          optionId: null,
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
  } else {
    // MULTI_CHOICE topic
    // Get vote statistics per option
    const voteStats = await prisma.topicVote.groupBy({
      by: ["optionId"],
      where: {
        topicId: topic.id,
        optionId: { not: null },
      },
      _count: true,
    });

    const optionVoteCounts: Record<string, number> = {};
    let totalVotes = 0;

    voteStats.forEach((stat) => {
      if (stat.optionId) {
        optionVoteCounts[stat.optionId] = stat._count;
        totalVotes += stat._count;
      }
    });

    // Get user's votes if authenticated
    let userVotes: string[] = [];
    if (userId) {
      const votes = await prisma.topicVote.findMany({
        where: {
          userId,
          topicId: topic.id,
          optionId: { not: null },
        },
        select: { optionId: true },
      });
      userVotes = votes.map((v) => v.optionId).filter((id): id is string => id !== null);
    }

    return {
      ...topic,
      optionVoteCounts,
      totalVotes,
      userVotes,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopicData(params.slug);

  if (!topic) {
    return {
      title: "Topic not found - TheBatee",
      description: "The topic you are looking for does not exist or has been removed.",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";
  const topicUrl = `${baseUrl}/t/${topic.slug}`;

  // Generate keywords from tags and content
  const keywords = [
    ...topic.tags,
    "debate",
    "discussion",
    "forum",
    topic.language === "pt" ? "debate" : "",
    topic.language === "en" ? "debate" : "",
    topic.language === "es" ? "debate" : "",
    topic.language === "fr" ? "débat" : "",
    topic.language === "de" ? "Debatte" : "",
  ]
    .filter(Boolean)
    .join(", ");

  // Language-specific locale mapping
  const localeMap: Record<string, string> = {
    pt: "pt_PT",
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
  };

  return {
    title: `${topic.title} - Thebate`,
    description: topic.description.substring(0, 160),
    keywords,
    authors: [{ name: topic.createdBy.name || topic.createdBy.username || "Unknown" }],
    creator: topic.createdBy.name || topic.createdBy.username || "Unknown",
    publisher: "Thebate",
    openGraph: {
      title: topic.title,
      description: topic.description.substring(0, 160),
      type: "article",
      publishedTime: topic.createdAt.toISOString(),
      modifiedTime: topic.updatedAt.toISOString(),
      authors: [topic.createdBy.username || topic.createdBy.name || "TheBate"],
      tags: topic.tags,
      url: topicUrl,
      siteName: "TheBatee",
      locale: localeMap[topic.language] || "en_US",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: topic.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description.substring(0, 160),
      creator: "@thebatee",
      site: "@thebatee",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: topicUrl,
      languages: {
        "x-default": topicUrl,
        [topic.language]: topicUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const session = await auth();
  const topic = await getTopicData(params.slug, session?.user?.id);

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
  const optionId = searchParams.optionId;
  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";
  const topicUrl = `${baseUrl}/t/${topic.slug}`;

  // Enhanced JSON-LD structured data for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "@id": topicUrl,
    headline: topic.title,
    text: topic.description,
    datePublished: topic.createdAt.toISOString(),
    dateModified: topic.updatedAt.toISOString(),
    inLanguage: topic.language,
    url: topicUrl,
    author: {
      "@type": "Person",
      name: topic.createdBy.name || topic.createdBy.username || "Unknown",
      url: topic.createdBy.username ? `${baseUrl}/u/${topic.createdBy.username}` : baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Thebate",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo_no_bg.png`,
      },
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: topic._count.comments,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/VoteAction",
        userInteractionCount:
          topic.type === "YES_NO"
            ? "voteStats" in topic
              ? topic.voteStats.total
              : 0
            : "totalVotes" in topic
              ? topic.totalVotes
              : 0,
      },
    ],
    keywords: topic.tags.join(", "),
    isPartOf: {
      "@type": "WebSite",
      name: "Thebate",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": topicUrl,
    },
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
                Este tema está {topic.status === "HIDDEN" ? "oculto" : "bloqueado"}
              </div>
            )}

            <div className="mb-4 flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between">
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{topic.title}</h1>
              <div className="flex gap-2 self-end sm:self-start">
                <ShareButton
                  title={topic.title}
                  description={topic.description.substring(0, 200)}
                  url={topicUrl}
                  hashtags={topic.tags.slice(0, 3)}
                />
                {session?.user && <ReportTopicButton slug={topic.slug} />}
              </div>
            </div>

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

            <p className="mb-4 whitespace-pre-wrap text-muted-foreground">{topic.description}</p>

            {/* Topic metadata - responsive layout */}
            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {topic.createdBy.username && (
                <Link href={`/u/${topic.createdBy.username}`} className="hover:underline">
                  @{topic.createdBy.username}
                </Link>
              )}

              <span className="hidden sm:inline">•</span>

              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {new Date(topic.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="sm:hidden">
                  {new Date(topic.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>

              <span className="hidden sm:inline">•</span>

              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {topic._count.comments}
                <span className="hidden sm:inline">
                  comentário{topic._count.comments !== 1 ? "s" : ""}
                </span>
              </span>
            </div>
          </div>

          {/* Theme Voting Section */}
          <div className="mb-8 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Vote no tema</h2>
            <div className="mb-6">
              {topic.type === "YES_NO" ? (
                <ThemeVoteButtons
                  topicSlug={topic.slug}
                  userVote={"userVote" in topic ? topic.userVote : null}
                  disabled={false}
                />
              ) : (
                <MultiChoiceVoteButtons
                  topicSlug={topic.slug}
                  options={topic.options}
                  userVotes={"userVotes" in topic ? topic.userVotes : []}
                  allowMultipleVotes={topic.allowMultipleVotes}
                  maxChoices={topic.maxChoices}
                  disabled={false}
                />
              )}
            </div>
            {topic.type === "YES_NO" ? (
              <ThemeVoteResults
                voteStats={
                  "voteStats" in topic ? topic.voteStats : { SIM: 0, NAO: 0, DEPENDE: 0, total: 0 }
                }
              />
            ) : (
              <MultiChoiceVoteResults
                options={topic.options}
                optionVoteCounts={"optionVoteCounts" in topic ? topic.optionVoteCounts : {}}
                totalVotes={"totalVotes" in topic ? topic.totalVotes : 0}
              />
            )}
          </div>

          {/* New Comment Form */}
          {topic.status !== "LOCKED" && (
            <div className="mb-8">
              {session?.user ? (
                <NewCommentForm
                  topicId={topic.id}
                  topicType={topic.type}
                  options={topic.type === "MULTI_CHOICE" ? topic.options : undefined}
                />
              ) : (
                <div className="rounded-lg border bg-muted/50 px-6 py-8 text-center">
                  <p className="mb-4 text-muted-foreground">Entre para participar da discussão</p>
                  <Link href={`/auth/login?callbackUrl=/t/${topic.slug}`}>
                    <Button>Entrar</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {topic.status === "LOCKED" && (
            <div className="mb-8 rounded-lg border border-yellow-500 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800">
              Este tema está bloqueado. Não é possível adicionar novos argumentos.
            </div>
          )}

          {/* Comments Section */}
          <div>
            <div className="mb-6">
              <h2 className="mb-4 text-2xl font-bold">Argumentos</h2>
              <div className="flex flex-col gap-3">
                {/* Sort buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-muted-foreground">Ordenar:</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/t/${topic.slug}?sort=top${side ? `&side=${side}` : ""}`}
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        variant={sort === "top" ? "default" : "outline"}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Top
                      </Button>
                    </Link>
                    <Link
                      href={`/t/${topic.slug}?sort=new${side ? `&side=${side}` : ""}`}
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        variant={sort === "new" ? "default" : "outline"}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Novos
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Side/Option filter buttons */}
                {topic.type === "YES_NO" ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
                    <div className="flex gap-2">
                      <Link href={`/t/${topic.slug}?sort=${sort}`} className="flex-1 sm:flex-none">
                        <Button
                          variant={!side ? "default" : "outline"}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          Todos
                        </Button>
                      </Link>
                      <Link
                        href={`/t/${topic.slug}?sort=${sort}&side=AFAVOR`}
                        className="flex-1 sm:flex-none"
                      >
                        <Button
                          variant={side === "AFAVOR" ? "default" : "outline"}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <span className="hidden sm:inline">👍 A Favor</span>
                          <span className="sm:hidden">👍</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/t/${topic.slug}?sort=${sort}&side=CONTRA`}
                        className="flex-1 sm:flex-none"
                      >
                        <Button
                          variant={side === "CONTRA" ? "default" : "outline"}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <span className="hidden sm:inline">👎 Contra</span>
                          <span className="sm:hidden">👎</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Filtrar por opção:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/t/${topic.slug}?sort=${sort}`} className="flex-none">
                        <Button variant={!optionId ? "default" : "outline"} size="sm">
                          Todos
                        </Button>
                      </Link>
                      {topic.options.map((option) => (
                        <Link
                          key={option.id}
                          href={`/t/${topic.slug}?sort=${sort}&optionId=${option.id}`}
                          className="flex-none"
                        >
                          <Button
                            variant={optionId === option.id ? "default" : "outline"}
                            size="sm"
                          >
                            {option.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CommentsList
              topicSlug={topic.slug}
              sort={sort as "top" | "new"}
              side={side}
              optionId={optionId}
            />
          </div>

          {/* Next Topic Navigation */}
          <NextTopicNavigation currentSlug={topic.slug} />

          {/* Advertisement - At the end of all content */}
          <AdContainer />
        </main>
      </div>
    </>
  );
}
