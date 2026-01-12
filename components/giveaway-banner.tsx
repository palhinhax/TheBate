"use client";

import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/use-translations";

export function GiveawayBanner() {
  const { t } = useTranslations();

  return (
    <div className="relative overflow-hidden rounded-lg border border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg dark:from-amber-950/30 dark:to-yellow-950/30">
      <div className="absolute -right-6 -top-6 h-24 w-24 rotate-12 opacity-10">
        <Gift className="h-full w-full" />
      </div>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500 p-2 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
              {t("giveaway.banner.title")}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {t("giveaway.banner.subtitle")}
            </p>
          </div>
        </div>
        <Link href="/giveaway">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md"
          >
            {t("giveaway.banner.cta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
