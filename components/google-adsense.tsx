"use client";

import { useEffect } from "react";

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

  useEffect(() => {
    // Only push if we have valid IDs
    if (!adClient || !adSlot || adSlot === "0000000000") return;
    
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
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
        <p className="text-sm text-muted-foreground">
          Configure ad slot ID
        </p>
      </div>
    );
  }

  const inlineStyle = adLayout === "in-article" 
    ? { display: "block", textAlign: "center" as const }
    : { display: "block" };

  return (
    <ins
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
