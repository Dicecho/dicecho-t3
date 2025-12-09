import { UserCardSkeleton } from "@/components/Search/UserCardSkeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
