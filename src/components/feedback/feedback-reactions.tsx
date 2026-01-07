"use client";

interface Reactions {
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
  total_count: number;
}

interface FeedbackReactionsProps {
  reactions: Reactions;
}

const REACTION_EMOJI: Record<keyof Omit<Reactions, "total_count" | "url">, string> = {
  "+1": "👍",
  "-1": "👎",
  laugh: "😄",
  hooray: "🎉",
  confused: "😕",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

export function FeedbackReactions({ reactions }: FeedbackReactionsProps) {
  if (reactions.total_count === 0) {
    return null;
  }

  const reactionEntries = Object.entries(REACTION_EMOJI).filter(
    ([key]) => reactions[key as keyof typeof REACTION_EMOJI] > 0
  );

  if (reactionEntries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {reactionEntries.map(([key, emoji]) => {
        const count = reactions[key as keyof typeof REACTION_EMOJI];
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
          >
            <span>{emoji}</span>
            <span className="text-muted-foreground">{count}</span>
          </span>
        );
      })}
    </div>
  );
}
