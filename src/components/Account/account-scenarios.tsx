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
import { ScenarioCard } from "@/components/Scenario/ScenarioCard";

interface AccountScenariosProps {
  user: IUserDto;
}

export const AccountScenarios = ({ user }: AccountScenariosProps) => {
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
          <CardTitle>{t("submitted_works")}</CardTitle>
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
          <CardTitle>{t("submitted_works")}</CardTitle>
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
        <CardTitle>{t("submitted_works")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.data.map((module) => (
            <LinkWithLng key={module._id} href={`/scenario/${module._id}`}>
              <ScenarioCard
                compact
                scenario={{
                  coverUrl: module.coverUrl,
                  title: module.title,
                  author: module.author,
                  rateAvg: module.rateAvg,
                  rateCount: module.rateCount,
                }}
              />
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
