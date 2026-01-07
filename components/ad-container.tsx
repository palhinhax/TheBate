import * as React from "react";
import { cn } from "@/lib/utils";

interface AdContainerProps {
  className?: string;
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
export function AdContainer({ className }: AdContainerProps) {
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
      <div className="text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Publicidade
        </p>
        <div className="flex h-[180px] w-full max-w-[728px] items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-background/50 px-4 sm:h-[150px]">
          <p className="text-sm text-muted-foreground">
            Espaço reservado para anúncio
          </p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Anúncios ajudam a manter a plataforma gratuita
        </p>
      </div>
    </aside>
  );
}
