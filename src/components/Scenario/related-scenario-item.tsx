"use client";

import type { FC, HTMLAttributes } from "react";
import type { IModDto } from "@dicecho/types";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/User/Avatar";

interface RelatedScenarioItemProps extends HTMLAttributes<HTMLDivElement> {
  scenario: IModDto;
}

export const RelatedScenarioItem: FC<RelatedScenarioItemProps> = ({
  scenario,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "group flex cursor-pointer py-2",
        "[&+&]:border-t [&+&]:border-border",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center">
          <div
            className="flex-1 truncate font-bold transition-colors group-hover:text-primary"
            title={scenario.title}
          >
            {scenario.title}
          </div>
          {scenario.rateAvg > 0 && (
            <>
              <span className="ml-2 font-bold text-yellow-500">
                {scenario.rateAvg}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({scenario.rateCount})
              </span>
            </>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserAvatar
            user={scenario.author}
            className="mr-2 h-5 w-5"
          />
          <span className="truncate">{scenario.author.nickName}</span>
        </div>
      </div>
    </div>
  );
};
