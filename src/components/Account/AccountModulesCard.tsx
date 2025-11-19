"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty } from "@/components/Empty";
import { Button } from "@/components/ui/button";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { useAccount } from "@/hooks/useAccount";
import type { IUserDto } from "@dicecho/types";
import { ControllablePagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountModulesCardProps {
  user: IUserDto;
}

export const AccountModulesCard = ({ user }: AccountModulesCardProps) => {
  const { t } = useTranslation();
  const { api } = useDicecho();
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["module", "list", { author: user._id, page, pageSize }],
    queryFn: () =>
      api.module.list({
        filter: { author: user._id },
        page,
        pageSize,
      }),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>投稿作品</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    if (!isSelf) {
      return null;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>投稿作品</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <LinkWithLng href={`/module/submission`}>
              <Button color="primary">{t("submit_now")}</Button>
            </LinkWithLng>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>投稿作品</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.data.map((module) => (
            <LinkWithLng
              key={module._id}
              href={`/scenario/${module._id}`}
            >
                <div className="group relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
                <img
                  src={module.coverUrl}
                  alt={module.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="line-clamp-2 text-sm font-medium text-white">
                    {module.title}
                  </div>
                </div>
              </div>
            </LinkWithLng>
          ))}
        </div>
        {data.totalCount > pageSize && (
          <div className="mt-4">
            <ControllablePagination
              current={data.page}
              total={Math.ceil(data.totalCount / data.pageSize)}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

