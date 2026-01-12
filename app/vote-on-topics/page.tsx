import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Vote on Controversial Topics - Share Your Opinion | TheBatee",
  description:
    "Vote on controversial topics and trending debates. Share your opinion on technology, politics, society, and culture. See real-time results from thousands of voters worldwide.",
  keywords: [
    "vote on topics",
    "controversial topics",
    "online voting",
    "public opinion",
    "vote on debates",
    "share opinion",
    "trending topics",
    "political polls",
    "social issues voting",
  ],
  openGraph: {
    title: "Vote on Controversial Topics - Share Your Opinion",
    description:
      "Share your opinion on technology, politics, society, and culture. See real-time results from thousands of voters worldwide.",
    type: "website",
  },
  alternates: {
    canonical: "https://thebatee.com/vote-on-topics",
  },
};

async function getTrendingTopics() {
  try {
    const topics = await prisma.topic.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return topics;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export default async function VoteOnTopicsPage() {
  const topics = await getTrendingTopics();
  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/vote-on-topics`,
    url: `${baseUrl}/vote-on-topics`,
    name: "Vote on Topics That Matter",
    description:
      "Share your opinion on technology, politics, society, and culture. See real-time results from thousands of voters.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-background to-muted/50 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Vote on Topics That Matter
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Your opinion counts. Vote on debates from around the world.
            </p>
            <div className="mt-8">
              <Link href="/">
                <Button size="lg" className="text-lg">
                  Browse Debates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="container mx-auto max-w-4xl px-4 py-12">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Join thousands of people voting on the most interesting and controversial topics of our
            time. From AI ethics to climate change, from social issues to tech innovations, find
            debates that match your interests and make your voice heard.
          </p>
        </section>

        {/* Categories */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Explore Debate Categories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/?q=technology"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">Technology & AI</h3>
                <p className="text-sm text-muted-foreground">
                  AI ethics, programming, gadgets, and digital innovation
                </p>
              </Link>
              <Link
                href="/?q=politics"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">Politics & Society</h3>
                <p className="text-sm text-muted-foreground">
                  Social policies, governance, and public issues
                </p>
              </Link>
              <Link
                href="/?q=culture"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">Culture & Entertainment</h3>
                <p className="text-sm text-muted-foreground">
                  Movies, music, art, and cultural trends
                </p>
              </Link>
              <Link
                href="/?q=science"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">Science & Health</h3>
                <p className="text-sm text-muted-foreground">
                  Medical advances, research, and scientific discoveries
                </p>
              </Link>
              <Link
                href="/?q=lifestyle"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">Lifestyle & Philosophy</h3>
                <p className="text-sm text-muted-foreground">
                  Personal development, ethics, and life choices
                </p>
              </Link>
              <Link
                href="/"
                className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold">View All Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Explore debates across all topics and languages
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* How Voting Works */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">How Voting Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <p className="text-lg">Browse debates or search for topics you care about</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <p className="text-lg">Read the debate description and see current results</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <p className="text-lg">Cast your vote: Yes, No, or It Depends</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  4
                </div>
                <div>
                  <p className="text-lg">Share your reasoning in the comments section</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  5
                </div>
                <div>
                  <p className="text-lg">See how your vote compares to the global community</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Vote on TheBatee?</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Anonymous Voting</h3>
                  <p className="text-muted-foreground">
                    Your votes are private. No one can see how you voted unless you choose to
                    comment.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Real Results</h3>
                  <p className="text-muted-foreground">
                    See actual statistics from real people, not bots or fake accounts.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Diverse Perspectives</h3>
                  <p className="text-muted-foreground">
                    Read comments from people across different countries, cultures, and backgrounds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Change Your Mind</h3>
                  <p className="text-muted-foreground">
                    You can change your vote at any time as you learn more from the discussion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Debates */}
        {topics.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">Trending Debates Right Now</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/t/${topic.slug}`}
                    className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
                  >
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{topic.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{topic._count.comments} comments</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/">
                  <Button variant="outline" size="lg">
                    View All Debates
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Start Voting Today</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join our global community and make your opinion count.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
