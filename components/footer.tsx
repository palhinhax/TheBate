"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/use-translations";

export function Footer() {
  const [version, setVersion] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion(null));
  }, []);

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* SEO Links Section */}
        <div className="mb-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("footer.platform_features")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/create-debate" className="transition-colors hover:text-foreground">
                  {t("footer.create_debate_online")}
                </Link>
              </li>
              <li>
                <Link href="/vote-on-topics" className="transition-colors hover:text-foreground">
                  {t("footer.vote_on_topics")}
                </Link>
              </li>
              <li>
                <Link
                  href="/public-opinion-polls"
                  className="transition-colors hover:text-foreground"
                >
                  {t("footer.public_opinion_polls")}
                </Link>
              </li>
              <li>
                <Link
                  href="/online-voting-platform"
                  className="transition-colors hover:text-foreground"
                >
                  {t("footer.online_voting_platform")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("footer.explore_topics")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/?q=technology" className="transition-colors hover:text-foreground">
                  {t("footer.technology_ai")}
                </Link>
              </li>
              <li>
                <Link href="/?q=politics" className="transition-colors hover:text-foreground">
                  {t("footer.politics_society")}
                </Link>
              </li>
              <li>
                <Link href="/?q=culture" className="transition-colors hover:text-foreground">
                  {t("footer.culture")}
                </Link>
              </li>
              <li>
                <Link
                  href="/debate-controversial-topics"
                  className="transition-colors hover:text-foreground"
                >
                  {t("footer.controversial_topics")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("footer.community")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/?sort=trending" className="transition-colors hover:text-foreground">
                  {t("footer.trending_debates")}
                </Link>
              </li>
              <li>
                <Link href="/?sort=new" className="transition-colors hover:text-foreground">
                  {t("footer.new_debates")}
                </Link>
              </li>
              <li>
                <Link href="/giveaway" className="transition-colors hover:text-foreground">
                  {t("footer.giveaway")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("footer.legal_support")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/terms" className="transition-colors hover:text-foreground">
                  {t("footer.terms_of_service")}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="transition-colors hover:text-foreground">
                  {t("footer.privacy_policy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground/60 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <p>{t("footer.copyright")}</p>
              <p className="hidden sm:inline">|</p>
              <p>{t("footer.tagline")}</p>
            </div>
            {version && <p className="font-mono">v{version}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
