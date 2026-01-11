"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

export default function NotFound() {
  const { t, isLoading } = useTranslations();

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
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>

        <h1 className="mb-2 text-6xl font-bold">404</h1>

        <h2 className="mb-4 text-2xl font-semibold">
          {t("errors.not_found_title", "Page not found")}
        </h2>

        <p className="mb-8 text-muted-foreground">
          {t(
            "errors.not_found_description",
            "The page you're looking for doesn't exist or has been moved.",
          )}
        </p>

        <Link href="/">
          <Button>{t("errors.go_home", "Go to Homepage")}</Button>
        </Link>
      </div>
    </div>
  );
}
