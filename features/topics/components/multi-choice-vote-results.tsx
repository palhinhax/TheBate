"use client";

type TopicOption = {
  id: string;
  label: string;
  description?: string | null;
};

type OptionVoteCount = {
  optionId: string;
  count: number;
};

type MultiChoiceVoteResultsProps = {
  options: TopicOption[];
  optionVoteCounts: Record<string, number>;
  totalVotes: number;
};

export default function MultiChoiceVoteResults({
  options,
  optionVoteCounts,
  totalVotes,
}: MultiChoiceVoteResultsProps) {
  // Calculate rankings
  const optionsWithVotes = options.map((option) => ({
    ...option,
    votes: optionVoteCounts[option.id] || 0,
    percentage:
      totalVotes > 0
        ? Math.round(((optionVoteCounts[option.id] || 0) / totalVotes) * 100)
        : 0,
  }));

  // Sort by vote count (descending)
  const sortedOptions = [...optionsWithVotes].sort((a, b) => b.votes - a.votes);

  // Colors for top options
  const colors = [
    { bar: "bg-yellow-600 dark:bg-yellow-500", text: "text-yellow-600 dark:text-yellow-500" },
    { bar: "bg-gray-400 dark:bg-gray-500", text: "text-gray-600 dark:text-gray-500" },
    { bar: "bg-orange-600 dark:bg-orange-500", text: "text-orange-600 dark:text-orange-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Ranking</span>
        <span className="text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
        </span>
      </div>

      {totalVotes === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 px-4 py-8 text-center text-sm text-muted-foreground">
          Seja o primeiro a votar neste tema
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOptions.map((option, index) => {
            const rank = index + 1;
            const color = colors[index] || { 
              bar: "bg-primary", 
              text: "text-primary" 
            };
            
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">
                      #{rank}
                    </span>
                    <span className={`font-medium ${color.text}`}>
                      {option.label}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {option.percentage}% ({option.votes})
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${color.bar}`}
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
