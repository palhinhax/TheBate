import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Debate Controversial Topics - Safe Discussion Space | TheBatee",
  description:
    "Debate controversial topics in a respectful environment. Discuss AI ethics, politics, social issues, and more. Moderated platform for civil discourse.",
  keywords: [
    "controversial topics",
    "debate platform",
    "civil discourse",
    "political debates",
    "social issues",
    "controversial discussions",
    "safe debate space",
  ],
  alternates: {
    canonical: "https://thebatee.com/debate-controversial-topics",
  },
};

export default function DebateControversialPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-background to-muted/50 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Debate Controversial Topics Safely
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explore difficult questions in a respectful, moderated environment
          </p>
          <div className="mt-8">
            <Link href="/">
              <Button size="lg">Browse Controversial Debates</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Not all topics are easy to discuss. TheBatee provides a space where people can debate
          controversial subjects with respect and civility. Our moderation system ensures
          discussions stay constructive while allowing genuine disagreement and diverse
          perspectives.
        </p>
      </section>
    </div>
  );
}
