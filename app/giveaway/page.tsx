import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle2, XCircle } from "lucide-react";
import { GiveawayEntryButton } from "./giveaway-entry-button";

export const metadata: Metadata = {
  title: "Win €50 - Giveaway - TheBatee",
  description:
    "Win €50 just for having an opinion. Enter our giveaway by creating an account and voting in a debate.",
};

async function getActiveGiveaway() {
  const now = new Date();

  const giveaway = await prisma.giveaway.findFirst({
    where: {
      status: "ACTIVE",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      winner: {
        select: {
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          entries: true,
        },
      },
    },
  });

  return giveaway;
}

async function getUserEntry(userId: string, giveawayId: string) {
  const entry = await prisma.giveawayEntry.findUnique({
    where: {
      giveawayId_userId: {
        giveawayId,
        userId,
      },
    },
  });

  return entry;
}

async function hasUserVoted(userId: string) {
  const voteCount = await prisma.topicVote.count({
    where: { userId },
  });

  return voteCount > 0;
}

export default async function GiveawayPage() {
  const session = await auth();
  const giveaway = await getActiveGiveaway();

  if (!giveaway) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-lg border bg-card p-12 text-center">
          <XCircle className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">No Active Giveaway</h1>
          <p className="mt-2 text-muted-foreground">
            There is no active giveaway at the moment. Check back soon!
          </p>
          <Link href="/">
            <Button className="mt-6">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userEntry = session?.user?.id ? await getUserEntry(session.user.id, giveaway.id) : null;
  const hasVoted = session?.user?.id ? await hasUserVoted(session.user.id) : false;

  const title =
    typeof giveaway.title === "object"
      ? (giveaway.title as Record<string, string>).en || ""
      : giveaway.title;

  const description =
    typeof giveaway.description === "object"
      ? (giveaway.description as Record<string, string>).en || ""
      : giveaway.description;

  const daysLeft = Math.ceil(
    (new Date(giveaway.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 p-6">
            <Gift className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="text-xl text-muted-foreground">{description}</p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
            {daysLeft} {daysLeft === 1 ? "day" : "days"} left
          </span>
          <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-900 dark:bg-blue-900/30 dark:text-blue-100">
            {giveaway._count.entries} {giveaway._count.entries === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {/* Entry Status */}
      {session?.user ? (
        <div className="mb-12">
          {userEntry ? (
            <div className="rounded-lg border border-green-500 bg-green-50 p-6 text-center dark:bg-green-950/30">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
              <h2 className="mt-4 text-xl font-bold text-green-900 dark:text-green-100">
                You&apos;re Entered!
              </h2>
              <p className="mt-2 text-green-700 dark:text-green-300">
                You&apos;ve successfully entered the giveaway. Winner will be announced on{" "}
                {new Date(giveaway.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                .
              </p>
              {!userEntry.hasVoted && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                  💡 Tip: Vote in a debate to complete your entry!
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Enter the Giveaway</h2>
              <p className="mb-6 text-muted-foreground">
                Click below to enter. No purchase necessary!
              </p>
              <GiveawayEntryButton giveawayId={giveaway.id} hasVoted={hasVoted} />
            </div>
          )}
        </div>
      ) : (
        <div className="mb-12 rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Sign In to Enter</h2>
          <p className="mb-6 text-muted-foreground">
            Create a free account to enter the giveaway. It takes less than 30 seconds!
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
              Create Account & Enter
            </Button>
          </Link>
        </div>
      )}

      {/* Prize Details */}
      <div className="mb-12 rounded-lg border bg-card p-8">
        <h2 className="mb-4 text-2xl font-bold">🎁 Prize</h2>
        <p className="text-lg">{giveaway.prize}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The winner will be contacted via email and the prize will be sent electronically.
        </p>
      </div>

      {/* How to Enter */}
      <div className="mb-12 rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-2xl font-bold">📝 How to Enter</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <div>
              <h3 className="font-semibold">Create a Free Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up with your email or social login. Takes less than 30 seconds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <div>
              <h3 className="font-semibold">Vote in at Least One Debate</h3>
              <p className="text-sm text-muted-foreground">
                Share your opinion on any debate topic. Your vote is your entry!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Optional: Comment on a Debate</h3>
              <p className="text-sm text-muted-foreground">
                Share your thoughts to engage with the community (not required for entry).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-2xl font-bold">📜 Official Rules</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Eligibility:</strong> Open to all users 18 years or older. One entry per person.
          </p>
          <p>
            <strong>Entry Period:</strong>{" "}
            {new Date(giveaway.startDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            to{" "}
            {new Date(giveaway.endDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Winner Selection:</strong> One winner will be selected randomly from all
            eligible entries after the entry period ends.
          </p>
          <p>
            <strong>Winner Notification:</strong> The winner will be contacted via email within 48
            hours of selection and announced publicly on the site.
          </p>
          <p>
            <strong>Prize Delivery:</strong> The prize will be sent electronically to the
            winner&apos;s email address.
          </p>
          <p>
            <strong>No Purchase Necessary:</strong> No purchase or payment is required to enter or
            win.
          </p>
          <p>
            <strong>Affiliation:</strong> This giveaway is not sponsored, endorsed, or administered
            by Amazon or any other brand mentioned. All trademarks are property of their respective
            owners.
          </p>
          <p>
            <strong>Privacy:</strong> Your information will only be used for the giveaway and will
            not be shared with third parties. See our{" "}
            <Link href="/legal/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            <strong>Terms:</strong> By entering, you agree to these rules and our{" "}
            <Link href="/legal/terms" className="text-primary underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>

      {/* CTA */}
      {!session?.user && (
        <div className="mt-12 text-center">
          <Link href="/auth/register">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
              Create Account & Enter Now
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
