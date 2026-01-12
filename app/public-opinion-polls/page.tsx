import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Public Opinion Polls Platform - Real-Time Survey Results | TheBatee",
  description:
    "Create and participate in public opinion polls. Get real-time survey results on any topic. Free polling platform with instant analytics and global reach.",
  keywords: [
    "public opinion polls",
    "online polls",
    "survey platform",
    "public voting",
    "opinion polls",
    "free polling",
    "survey results",
    "poll creator",
  ],
  alternates: {
    canonical: "https://thebatee.com/public-opinion-polls",
  },
};

export default function PublicOpinionPollsPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-background to-muted/50 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Public Opinion Polls Platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Measure what the world really thinks with real-time polls
          </p>
          <div className="mt-8">
            <Link href="/auth/register">
              <Button size="lg">Start Polling Now</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-lg leading-relaxed text-muted-foreground">
          TheBatee is your go-to platform for creating and participating in public opinion polls.
          Whether you&apos;re a researcher, content creator, student, or just curious about what people
          think, our platform gives you the tools to gather genuine insights from a global audience.
        </p>
      </section>
    </div>
  );
}
