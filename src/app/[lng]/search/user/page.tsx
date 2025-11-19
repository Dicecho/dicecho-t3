"use client";

import { UserSearchContent } from "@/components/Search/UserSearchContent";
import { UserCardSkeleton } from "@/components/Search/UserCardSkeleton";
import { Suspense } from "react";

export default function UserSearchPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>}>
      <UserSearchContent />
    </Suspense>
  );
}
