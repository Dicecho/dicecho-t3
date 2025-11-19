"use client";

import { TopicSearchContent } from "@/components/Search/TopicSearchContent";
import { TopicCardSkeleton } from "@/components/Search/TopicCardSkeleton";
import { Suspense } from "react";

export default function TopicSearchPage() {
  return (
    <Suspense fallback={<div className="flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <TopicCardSkeleton key={i} />
      ))}
    </div>}>
      <TopicSearchContent />
    </Suspense>
  );
}
