import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Online Voting Platform - Free Democratic Decision Making | TheBatee",
  description:
    "Free online voting platform for communities, groups, and public debates. Transparent democratic decision-making with real-time results and discussion features.",
  keywords: [
    "online voting platform",
    "democratic voting",
    "community voting",
    "online polls",
    "voting system",
    "decision making",
    "group voting",
  ],
  alternates: {
    canonical: "https://thebatee.com/online-voting-platform",
  },
};

export default function OnlineVotingPlatformPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-background to-muted/50 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Online Voting Platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Democratic decision-making for communities, groups, and the public
          </p>
          <div className="mt-8">
            <Link href="/auth/register">
              <Button size="lg">Create Free Vote</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-lg leading-relaxed text-muted-foreground">
          TheBatee is more than a debate platform—it&apos;s a complete online voting system designed
          for transparency, engagement, and democratic participation. Whether you&apos;re making
          decisions for a community, gathering team input, or measuring public sentiment, our
          platform makes voting simple and accessible.
        </p>
      </section>
    </div>
  );
}
