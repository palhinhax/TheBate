"use client";

type VoteStats = {
  SIM: number;
  NAO: number;
  DEPENDE: number;
  total: number;
};

type ThemeVoteResultsProps = {
  voteStats: VoteStats;
};

export default function ThemeVoteResults({ voteStats }: ThemeVoteResultsProps) {
  const { SIM, NAO, DEPENDE, total } = voteStats;

  // Calculate percentages
  const simPercent = total > 0 ? Math.round((SIM / total) * 100) : 0;
  const naoPercent = total > 0 ? Math.round((NAO / total) * 100) : 0;
  const dependePercent = total > 0 ? Math.round((DEPENDE / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Resultados da votação</span>
        <span className="text-muted-foreground">
          {total} {total === 1 ? "voto" : "votos"}
        </span>
      </div>

      {total === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 px-4 py-8 text-center text-sm text-muted-foreground">
          Seja o primeiro a votar neste tema
        </div>
      ) : (
        <div className="space-y-2">
          {/* Sim */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-green-600 dark:text-green-500">
                Sim
              </span>
              <span className="text-muted-foreground">
                {simPercent}% ({SIM})
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-green-600 transition-all dark:bg-green-500"
                style={{ width: `${simPercent}%` }}
              />
            </div>
          </div>

          {/* Não */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-red-600 dark:text-red-500">
                Não
              </span>
              <span className="text-muted-foreground">
                {naoPercent}% ({NAO})
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-red-600 transition-all dark:bg-red-500"
                style={{ width: `${naoPercent}%` }}
              />
            </div>
          </div>

          {/* Depende */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-yellow-600 dark:text-yellow-500">
                Depende
              </span>
              <span className="text-muted-foreground">
                {dependePercent}% ({DEPENDE})
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-yellow-600 transition-all dark:bg-yellow-500"
                style={{ width: `${dependePercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
