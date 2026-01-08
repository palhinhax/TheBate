import * as React from "react";
import { cn } from "@/lib/utils";
import { GoogleAdSense } from "./google-adsense";

interface AdContainerProps {
  className?: string;
  adSlot?: string;
  adLayout?: string;
  adFormat?: string;
}

/**
 * AdContainer - Componente isolado para exibir anúncios não intrusivos
 *
 * Características:
 * - Sempre visível de forma passiva
 * - Sem reprodução automática de vídeo ou som
 * - Sem animações agressivas
 * - Responsivo para desktop e mobile
 * - Máximo de 1 anúncio por página
 */
export function AdContainer({ 
  className, 
  adSlot = "5814797320",
  adLayout = "in-article",
  adFormat = "fluid"
}: AdContainerProps) {
  return (
    <aside
      className={cn(
        "my-8 w-full rounded-lg border border-muted bg-muted/30 px-4 py-6",
        "flex flex-col items-center justify-center",
        "min-h-[250px] max-w-full",
        "sm:min-h-[200px]",
        className
      )}
      aria-label="Publicidade"
    >
      <div className="w-full text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Publicidade
        </p>
        <div className="mx-auto w-full max-w-[728px]">
          {adSlot ? (
            <GoogleAdSense
              adSlot={adSlot}
              adFormat={adFormat}
              adLayout={adLayout}
              fullWidthResponsive={true}
            />
          ) : (
            <div className="flex items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Espaço Publicitário
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
