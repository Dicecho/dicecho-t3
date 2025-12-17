"use client";

// import { UserCard } from "@/components/Search/UserCard";
// import { UserCardSkeleton } from "@/components/Search/UserCardSkeleton";
import { UserInfoCard } from "@/components/User/user-info-card";
import { UserInfoCardSkeleton } from "@/components/User/user-info-card-skeleton";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export function UserSearchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lng = params.lng as string;
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["search", "users", keyword],
    queryFn: () => api.search.user({ keyword, pageSize: 100 }),
    enabled: !!keyword,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <UserInfoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!usersData || usersData.totalCount === 0) {
    return <Empty emptyText={t("search_no_user")} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {usersData.data.map((user) => (
        <Link key={user._id} href={`/${lng}/account/${user._id}`}>
          <UserInfoCard user={user} className="shadow-md hover:shadow-lg" />
        </Link>
      ))}
    </div>
  );
}

