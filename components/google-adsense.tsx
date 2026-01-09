"use client";

import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  adLayout?: string;
  className?: string;
}

export function GoogleAdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  adLayout,
  className = "",
}: GoogleAdSenseProps) {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only push if we have valid IDs
    if (!adClient || !adSlot || adSlot === "0000000000") return;

    try {
      // Check if we're in a valid environment for AdSense
      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.includes("github.dev") ||
          window.location.hostname.includes("codespaces"));

      if (isLocalhost) {
        console.warn(
          "⚠️ Google AdSense: Anúncios não aparecem em localhost/codespaces. Faça deploy em produção."
        );
        return;
      }

      (window.adsbygoogle = window.adsbygoogle || []).push({});

      // Debug: verificar se o ad foi carregado
      setTimeout(() => {
        if (adRef.current) {
          const status = adRef.current.getAttribute("data-ad-status");
          if (status === "unfilled") {
            console.warn(
              "⚠️ Google AdSense: Nenhum anúncio disponível para mostrar. Pode demorar 24-48h após verificação do site."
            );
          } else if (!status) {
            console.warn(
              "⚠️ Google AdSense: Anúncio ainda a carregar ou bloqueado por ad blocker."
            );
          } else {
            console.log("✅ Google AdSense: Anúncio carregado com sucesso!");
          }
        }
      }, 2000);
    } catch (err) {
      console.error("❌ AdSense error:", err);
    }
  }, [adClient, adSlot]);

  if (!adClient) {
    return (
      <div className="flex items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Configure NEXT_PUBLIC_GOOGLE_ADSENSE_ID no .env
        </p>
      </div>
    );
  }

  // Don't render if slot is invalid placeholder
  if (!adSlot || adSlot === "0000000000") {
    return (
      <div className="flex items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Configure ad slot ID</p>
      </div>
    );
  }

  const inlineStyle =
    adLayout === "in-article"
      ? { display: "block", textAlign: "center" as const }
      : { display: "block" };

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={inlineStyle}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
