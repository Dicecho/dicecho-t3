"use client";

import clsx from "clsx";
import type { IModDto } from "@dicecho/types";
import { Avatar } from "@/components/ui/avatar";

interface RelatedScenarioItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  scenario: IModDto;
}

export function RelatedScenarioItem({
  scenario,
  className,
  ...props
}: RelatedScenarioItemProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 hover:border-primary transition-colors",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium" title={scenario.title}>
          {scenario.title}
        </div>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <Avatar className="mr-2 h-5 w-5">
            <img
              src={scenario.author.avatarUrl}
              alt={scenario.author.nickName}
              className="h-full w-full rounded-full object-cover"
            />
          </Avatar>
          <span className="truncate">{scenario.author.nickName}</span>
        </div>
      </div>
      {scenario.rateAvg > 0 && (
        <div className="ml-3 flex items-center text-primary">
          <span className="text-lg font-semibold">{scenario.rateAvg}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            ({scenario.rateCount})
          </span>
        </div>
      )}
    </div>
  );
}
