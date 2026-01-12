import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Globe, Share2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Your Own Debate Online - Free Discussion Platform | TheBatee",
  description:
    "Create your own debate online for free. Start meaningful discussions on any topic. Get votes, comments, and insights from a global community. Join TheBatee now!",
  keywords: [
    "create debate",
    "create debate online",
    "start discussion",
    "online debate platform",
    "free debate creation",
    "public discussion",
    "debate maker",
    "discussion forum",
    "create poll",
    "online voting",
  ],
  openGraph: {
    title: "Create Your Own Debate Online - Free Discussion Platform",
    description:
      "Start meaningful discussions on any topic. Get votes, comments, and insights from a global community.",
    type: "website",
  },
  alternates: {
    canonical: "https://thebatee.com/create-debate",
    languages: {
      "en-US": "https://thebatee.com/create-debate",
      "pt-PT": "https://thebatee.com/create-debate",
      "es-ES": "https://thebatee.com/create-debate",
      "fr-FR": "https://thebatee.com/create-debate",
      "de-DE": "https://thebatee.com/create-debate",
      "x-default": "https://thebatee.com/create-debate",
    },
  },
};

export default function CreateDebatePage() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";

  // FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can anyone create a debate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Creating debates on TheBatee is completely free and open to everyone. Simply create an account and you can start your first debate immediately.",
        },
      },
      {
        "@type": "Question",
        name: "What topics can I debate about?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can debate about almost anything: technology, politics, lifestyle, entertainment, science, and more. We only ask that debates remain respectful and follow our community guidelines.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a debate stay active?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Debates remain active indefinitely unless you choose to close them. The longer your debate is active, the more votes and comments it can receive.",
        },
      },
      {
        "@type": "Question",
        name: "Can I edit my debate after publishing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can edit your debate title and description at any time. This helps you clarify your question or add additional context.",
        },
      },
    ],
  };

  // WebPage structured data
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/create-debate`,
    url: `${baseUrl}/create-debate`,
    name: "Create Your Own Debate Online",
    description:
      "Start meaningful discussions on any topic. Get votes, comments, and insights from a global community.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@type": "Thing",
      name: "Online Debate Creation",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/og-image.png`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-background to-muted/50 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Create Your Own Debate Online
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Start meaningful discussions and see what the world thinks
            </p>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg">
                  Create Debate Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="container mx-auto max-w-4xl px-4 py-12">
          <p className="text-lg leading-relaxed text-muted-foreground">
            TheBatee is a free platform where anyone can create debates on topics that matter.
            Whether you&apos;re discussing technology, politics, society, or culture, our global
            community is ready to share their opinions and vote on your questions.
          </p>
        </section>

        {/* How It Works */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">How to Create a Debate</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Sign Up for Free</h3>
                <p className="text-muted-foreground">
                  Create your account in seconds. No credit card required.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Choose Your Topic</h3>
                <p className="text-muted-foreground">
                  Pick any subject you&apos;re passionate about or curious to explore.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Write Your Question</h3>
                <p className="text-muted-foreground">
                  Frame your debate as a clear yes/no question or multiple-choice poll.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <h3 className="mb-2 text-xl font-semibold">Get Results</h3>
                <p className="text-muted-foreground">
                  Watch votes come in and engage with comments from around the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Create Debates on TheBatee?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Global Audience</h3>
                  <p className="text-muted-foreground">
                    Reach people from over 100 countries in 12 languages.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Real-Time Voting</h3>
                  <p className="text-muted-foreground">
                    See instant results as people cast their votes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Engage with Comments</h3>
                  <p className="text-muted-foreground">
                    Read diverse perspectives and join the discussion.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Share Anywhere</h3>
                  <p className="text-muted-foreground">
                    Share your debate on social media and get more participants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Can anyone create a debate?</h3>
                <p className="text-muted-foreground">
                  Yes! Creating debates on TheBatee is completely free and open to everyone. Simply
                  create an account and you can start your first debate immediately.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">What topics can I debate about?</h3>
                <p className="text-muted-foreground">
                  You can debate about almost anything: technology, politics, lifestyle,
                  entertainment, science, and more. We only ask that debates remain respectful and
                  follow our community guidelines.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">How long does a debate stay active?</h3>
                <p className="text-muted-foreground">
                  Debates remain active indefinitely unless you choose to close them. The longer
                  your debate is active, the more votes and comments it can receive.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">
                  Can I edit my debate after publishing?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can edit your debate title and description at any time. This helps you
                  clarify your question or add additional context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Debate?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of users creating meaningful discussions every day.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg">
                Create Debate Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
