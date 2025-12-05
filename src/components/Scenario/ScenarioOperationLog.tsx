"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface ScenarioOperationLogProps {
  scenarioId: string;
}

export function ScenarioOperationLog({ scenarioId }: ScenarioOperationLogProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["scenario", scenarioId, "logs"],
    queryFn: () =>
      api.log.list("Mod", scenarioId, { page: 1, pageSize: 20 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("scenario_edit_log") ?? "编辑记录"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        {!isLoading &&
          data?.data.map((log) => (
            <div
              key={log._id}
              className="flex items-start gap-3 rounded-md border border-border px-3 py-2"
            >
              <Avatar className="h-8 w-8">
                <img
                  src={log.operator.avatarUrl}
                  alt={log.operator.nickName}
                  className="h-full w-full rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1 text-sm leading-relaxed">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{log.operator.nickName}</span>
                  <span className="text-muted-foreground">
                    {format(new Date(log.createdAt), "yyyy/MM/dd HH:mm")}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {log.action === "create"
                    ? t("scenario_log_create", { ns: "common" }) ?? "创建了条目"
                    : t("scenario_log_update", {
                        ns: "common",
                        fields: log.changedKeys.join("、"),
                      }) ?? `修改 ${log.changedKeys.join("、")}`}
                </div>
              </div>
            </div>
          ))}
        {!isLoading && (data?.data.length ?? 0) === 0 && (
          <div className="text-sm text-muted-foreground">
            {t("scenario_log_empty") ?? "暂无编辑记录"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
