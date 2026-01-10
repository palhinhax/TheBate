import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check Your Email - TheBate",
  description: "A magic link has been sent to your email",
};

export default function VerifyRequestPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you a magic link to sign in. Click the link in the
            email to continue.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t forget to check your spam folder if you don&apos;t see
            the email within a few minutes.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline" className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
