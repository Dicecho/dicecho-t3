"use client";

import { SearchLayoutContent } from "@/components/Search/SearchLayoutContent";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="mb-4 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>}>
      <SearchLayoutContent>{children}</SearchLayoutContent>
    </Suspense>
  );
}

