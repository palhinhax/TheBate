"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, isLoading } = useTranslations();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">
          {t("errors.page_title", "Something went wrong")}
        </h1>

        <p className="mb-8 text-muted-foreground">
          {t(
            "errors.page_description",
            "We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue."
          )}
        </p>

        {error.digest && (
          <p className="mb-6 text-sm text-muted-foreground">Error ID: {error.digest}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            {t("errors.try_again", "Try Again")}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{t("errors.go_home", "Go to Homepage")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
