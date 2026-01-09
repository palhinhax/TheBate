"use client";

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
          <p>© 2026 Thebatee. All rights reserved.</p>
          {version && <p className="font-mono">v{version}</p>}
        </div>
      </div>
    </footer>
  );
}
