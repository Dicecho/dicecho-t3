import { TopicCardSkeleton } from "@/components/Search/TopicCardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <TopicCardSkeleton key={i} />
      ))}
    </div>
  );
}
