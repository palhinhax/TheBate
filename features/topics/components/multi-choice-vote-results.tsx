"use client";

type TopicOption = {
  id: string;
  label: string;
  description: string | null;
  order: number;
};

type OptionVoteStat = {
  optionId: string;
  count: number;
};

type MultiChoiceVoteResultsProps = {
  options: TopicOption[];
  optionVoteStats: OptionVoteStat[];
  totalVotes: number;
};

export default function MultiChoiceVoteResults({
  options,
  optionVoteStats,
  totalVotes,
}: MultiChoiceVoteResultsProps) {
  // Calculate percentages and sort by vote count
  const optionResults = options
    .map((option) => {
      const stat = optionVoteStats.find((s) => s.optionId === option.id);
      const voteCount = stat?.count || 0;
      const percentage =
        totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
      return {
        ...option,
        voteCount,
        percentage,
      };
    })
    .sort((a, b) => b.voteCount - a.voteCount);

  const maxVotes = Math.max(...optionResults.map((r) => r.voteCount), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Resultados
        </h3>
        <span className="text-sm text-muted-foreground">
          {totalVotes} voto{totalVotes !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {optionResults.map((result, index) => (
          <div key={result.id} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="truncate font-medium">{result.label}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold">
                  {result.percentage}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({result.voteCount})
                </span>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${totalVotes > 0 ? (result.voteCount / maxVotes) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {totalVotes === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum voto registado ainda. Seja o primeiro a votar!
        </p>
      )}
    </div>
  );
}
