import { TagCardSkeleton } from "@/components/Search/TagCardSkeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <TagCardSkeleton key={i} />
      ))}
    </div>
  );
}
