import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { MessageSquare, Clock, Edit } from "lucide-react";
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

async function getRelatedTopics(currentTopicSlug: string, tags: string[], language: string) {
  // Find topics with similar tags or same language
  const relatedTopics = await prisma.topic.findMany({
    where: {
      slug: { not: currentTopicSlug },
      status: "ACTIVE",
      OR: [{ tags: { hasSome: tags } }, { language: language }],
    },
    select: {
      slug: true,
      title: true,
      language: true,
      tags: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return relatedTopics;
}

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

  // Use topic image if available, otherwise fallback to default OG image
  const imageUrl = topic.imageUrl || `${baseUrl}/og-image.png`;
  const imageWidth = topic.imageUrl ? 1200 : 1200;
  const imageHeight = topic.imageUrl ? 630 : 630;

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
    hi: "hi_IN",
    zh: "zh_CN",
    ar: "ar_SA",
    bn: "bn_BD",
    ru: "ru_RU",
    id: "id_ID",
    ja: "ja_JP",
  };

  // Generate rich description with vote stats
  const voteCount =
    topic.type === "YES_NO" && "voteStats" in topic
      ? topic.voteStats.total
      : "totalVotes" in topic
        ? topic.totalVotes
        : 0;

  const richDescription = `${topic.description.substring(0, 140)} | ${voteCount} votes, ${topic._count.comments} comments. Join the debate on TheBatee.`;

  return {
    title: `${topic.title} - TheBatee Debate`,
    description: richDescription,
    keywords,
    authors: [{ name: topic.createdBy.name || topic.createdBy.username || "Unknown" }],
    creator: topic.createdBy.name || topic.createdBy.username || "Unknown",
    publisher: "TheBatee",
    openGraph: {
      title: topic.title,
      description: richDescription,
      type: "article",
      publishedTime: topic.createdAt.toISOString(),
      modifiedTime: topic.updatedAt.toISOString(),
      authors: [topic.createdBy.username || topic.createdBy.name || "TheBatee"],
      tags: topic.tags,
      url: topicUrl,
      siteName: "TheBatee",
      locale: localeMap[topic.language] || "en_US",
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: topic.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: richDescription,
      creator: "@thebatee",
      site: "@thebatee",
      images: [imageUrl],
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
      "max-snippet": 300,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": 300,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "article:published_time": topic.createdAt.toISOString(),
      "article:modified_time": topic.updatedAt.toISOString(),
      "article:author": topic.createdBy.name || topic.createdBy.username || "Unknown",
      "article:section": topic.tags[0] || "Debate",
      "article:tag": topic.tags.join(", "),
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

  // Get related topics for internal linking
  const relatedTopics = await getRelatedTopics(topic.slug, topic.tags, topic.language);

  const sort = searchParams.sort || "top";
  const side = searchParams.side as "AFAVOR" | "CONTRA" | undefined;
  const optionId = searchParams.optionId;
  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";
  const topicUrl = `${baseUrl}/t/${topic.slug}`;

  // Use topic image if available for structured data
  const imageUrl = topic.imageUrl || `${baseUrl}/og-image.png`;

  // Enhanced JSON-LD structured data for better SEO
  // Use QAPage schema for YES_NO topics, DiscussionForumPosting for others
  const jsonLd =
    topic.type === "YES_NO"
      ? {
          "@context": "https://schema.org",
          "@type": "QAPage",
          "@id": topicUrl,
          mainEntity: {
            "@type": "Question",
            name: topic.title,
            text: topic.description,
            answerCount: topic._count.comments,
            upvoteCount: "voteStats" in topic ? topic.voteStats.SIM + topic.voteStats.DEPENDE : 0,
            downvoteCount: "voteStats" in topic ? topic.voteStats.NAO : 0,
            dateCreated: topic.createdAt.toISOString(),
            author: {
              "@type": "Person",
              name: topic.createdBy.name || topic.createdBy.username || "Unknown",
            },
          },
          datePublished: topic.createdAt.toISOString(),
          dateModified: topic.updatedAt.toISOString(),
          inLanguage: topic.language,
          url: topicUrl,
          image: topic.imageUrl
            ? {
                "@type": "ImageObject",
                url: imageUrl,
                width: 1200,
                height: 630,
              }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: "TheBatee",
            url: baseUrl,
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo_no_bg.png`,
            },
          },
          isPartOf: {
            "@type": "WebSite",
            name: "TheBatee - Global Discussion Platform",
            url: baseUrl,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "DiscussionForumPosting",
          "@id": topicUrl,
          headline: topic.title,
          text: topic.description,
          articleBody: topic.description,
          datePublished: topic.createdAt.toISOString(),
          dateModified: topic.updatedAt.toISOString(),
          inLanguage: topic.language,
          url: topicUrl,
          image: topic.imageUrl
            ? {
                "@type": "ImageObject",
                url: imageUrl,
                width: 1200,
                height: 630,
              }
            : undefined,
          author: {
            "@type": "Person",
            name: topic.createdBy.name || topic.createdBy.username || "Unknown",
            url: topic.createdBy.username ? `${baseUrl}/u/${topic.createdBy.username}` : baseUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "TheBatee",
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
              userInteractionCount: "totalVotes" in topic ? topic.totalVotes : 0,
            },
          ],
          keywords: topic.tags.join(", "),
          isPartOf: {
            "@type": "WebSite",
            name: "TheBatee - Global Discussion Platform",
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
              TheBatee
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
                {session?.user && (
                  <>
                    {(session.user.id === topic.createdBy.id ||
                      session.user.role === "ADMIN" ||
                      session.user.isOwner) && (
                      <Link href={`/t/${topic.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                    )}
                    <ReportTopicButton slug={topic.slug} />
                  </>
                )}
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

            {/* Main debate description - SEO-optimized content */}
            <div className="mb-6 space-y-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
              </div>

              {/* SEO-rich context section */}
              {topic.description.length < 300 && (
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    This debate explores the question:{" "}
                    <strong className="text-foreground">{topic.title}</strong>. Join thousands of
                    users sharing their perspectives on this important topic.
                  </p>
                  <p>
                    Share your opinion by voting{" "}
                    {topic.type === "YES_NO"
                      ? "yes, no, or it depends"
                      : "for your preferred option"}
                    , and join the discussion in the comments section below. Your voice matters in
                    shaping this global conversation.
                  </p>
                  {topic._count.comments > 0 && (
                    <p>
                      So far, {topic._count.comments} people have shared their thoughts on this
                      debate. Read their perspectives and add your own insights to enrich the
                      discussion.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Topic Image */}
            {topic.imageUrl && (
              <div className="mb-6 overflow-hidden rounded-lg border">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="h-auto w-full object-cover"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            )}

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
            <h2 className="mb-4 text-xl font-semibold">
              {topic.type === "YES_NO" ? "What's Your Stance?" : "Choose Your Position"}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Cast your vote to see how others view this debate. Your participation helps build a
              comprehensive understanding of public opinion on this important topic.
            </p>
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

          {/* Why This Debate Matters - SEO Content */}
          {topic.description.length < 400 && (
            <div className="mb-8 rounded-lg border bg-muted/30 p-6">
              <h2 className="mb-4 text-xl font-semibold">Why This Debate Matters</h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Debates like <strong className="text-foreground">{topic.title}</strong> are
                  crucial for understanding diverse perspectives in our global community. By
                  participating, you contribute to a richer, more nuanced understanding of complex
                  issues.
                </p>
                <p>
                  This discussion platform brings together voices from around the world, creating a
                  space where ideas can be exchanged respectfully and constructively. Whether you
                  agree or disagree, your perspective adds value to the conversation.
                </p>
                {topic.tags.length > 0 && (
                  <p>
                    Related topics include {topic.tags.slice(0, 3).join(", ")}. Explore these areas
                    to deepen your understanding and engage with similar debates that matter to you
                    and your community.
                  </p>
                )}
              </div>
            </div>
          )}

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

          {/* Related Debates - Internal Linking for SEO */}
          {relatedTopics.length > 0 && (
            <div className="mb-8 rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Related Debates</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Explore other thought-provoking discussions that might interest you:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedTopics.map((relatedTopic) => (
                  <Link
                    key={relatedTopic.slug}
                    href={`/t/${relatedTopic.slug}`}
                    className="group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/50"
                  >
                    <h3 className="mb-2 font-medium leading-tight group-hover:text-primary">
                      {relatedTopic.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{relatedTopic._count.comments} comments</span>
                      {relatedTopic.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="truncate">{relatedTopic.tags[0]}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Next Topic Navigation */}
          <NextTopicNavigation currentSlug={topic.slug} />

          {/* Advertisement - At the end of all content */}
          <AdContainer />
        </main>
      </div>
    </>
  );
}
