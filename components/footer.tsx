"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const [version, setVersion] = useState<string | null>(null);

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
            <h3 className="mb-3 text-sm font-semibold">Platform Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/create-debate" className="transition-colors hover:text-foreground">
                  Create Debate Online
                </Link>
              </li>
              <li>
                <Link href="/vote-on-topics" className="transition-colors hover:text-foreground">
                  Vote on Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/public-opinion-polls"
                  className="transition-colors hover:text-foreground"
                >
                  Public Opinion Polls
                </Link>
              </li>
              <li>
                <Link
                  href="/online-voting-platform"
                  className="transition-colors hover:text-foreground"
                >
                  Online Voting Platform
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Explore Topics</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/?q=technology" className="transition-colors hover:text-foreground">
                  Technology & AI
                </Link>
              </li>
              <li>
                <Link href="/?q=politics" className="transition-colors hover:text-foreground">
                  Politics & Society
                </Link>
              </li>
              <li>
                <Link href="/?q=culture" className="transition-colors hover:text-foreground">
                  Culture
                </Link>
              </li>
              <li>
                <Link
                  href="/debate-controversial-topics"
                  className="transition-colors hover:text-foreground"
                >
                  Controversial Topics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/?sort=trending" className="transition-colors hover:text-foreground">
                  Trending Debates
                </Link>
              </li>
              <li>
                <Link href="/?sort=new" className="transition-colors hover:text-foreground">
                  New Debates
                </Link>
              </li>
              <li>
                <Link href="/giveaway" className="transition-colors hover:text-foreground">
                  Giveaway
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal & Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/terms" className="transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground/60 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <p>© 2026 TheBatee. All rights reserved.</p>
              <p className="hidden sm:inline">|</p>
              <p>Global platform for debates and public opinion</p>
            </div>
            {version && <p className="font-mono">v{version}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
