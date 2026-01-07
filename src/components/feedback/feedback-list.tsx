"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { FeedbackCard } from "./feedback-card";
import { FeedbackCardSkeleton } from "./feedback-card-skeleton";

interface FeedbackListProps {
  state?: "open" | "closed" | "all";
  labels?: string;
}

export function FeedbackList({ state = "open", labels }: FeedbackListProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = api.feedback.list.useInfiniteQuery(
    { state, labels },
    {
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      staleTime: 60 * 1000,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <FeedbackCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Failed to load issues. Please try again later.
      </div>
    );
  }

  const issues = data?.pages.flatMap((page) => page.issues) ?? [];

  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        No issues found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {issues.map((issue) => (
        <FeedbackCard key={issue.number} issue={issue} />
      ))}
      <div ref={ref} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
