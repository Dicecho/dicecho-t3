"use client";

import { TagSearchContent } from "@/components/Search/TagSearchContent";
import { TagCardSkeleton } from "@/components/Search/TagCardSkeleton";
import { Suspense } from "react";

export default function TagSearchPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <TagCardSkeleton key={i} />
      ))}
    </div>}>
      <TagSearchContent />
    </Suspense>
  );
}
