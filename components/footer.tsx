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
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground/60 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <p>© 2026 TheBatee. All rights reserved.</p>
            <Link
              href="/legal/terms"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/legal/privacy"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
          {version && <p className="font-mono">v{version}</p>}
        </div>
      </div>
    </footer>
  );
}
