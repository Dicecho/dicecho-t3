import { UserInfoCardSkeleton } from "@/components/User/user-info-card-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <UserInfoCardSkeleton key={i} />
      ))}
    </div>
  );
}
