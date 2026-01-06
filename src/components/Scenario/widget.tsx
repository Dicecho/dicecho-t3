"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ISimpleScenarioDto {
  _id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  rateAvg?: number;
  rateCount?: number;
}

export interface ScenarioWidgetProps extends HTMLAttributes<HTMLDivElement> {
  scenario: ISimpleScenarioDto;
  action?: React.ReactNode;
  clickable?: boolean;
  variant?: "default" | "compact";
}

export const ScenarioWidget = forwardRef<HTMLDivElement, ScenarioWidgetProps>(
  ({ scenario, action, clickable = true, variant = "default", className, ...props }, ref) => {
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex w-full items-center gap-4 overflow-hidden rounded p-2",
            "bg-white/5 transition-all duration-300",
            clickable && "cursor-pointer hover:bg-white/10 [&_.mod-title]:hover:text-primary",
            className
          )}
          {...props}
        >
          {/* Blurred background mask */}
          {scenario.coverUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.4] blur-[6px]"
              style={{
                backgroundImage: `url(${scenario.coverUrl})`,
              }}
            />
          )}
          {/* Cover image */}
          <div
            className="relative z-[1] h-[60px] w-[45px] shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: scenario.coverUrl
                ? `url(${scenario.coverUrl}?width=90&height=120)`
                : undefined,
            }}
          />
          {/* Content */}
          <div className="relative z-[1] min-w-0 flex-1 overflow-hidden">
            <div className="mod-title flex items-center text-base font-bold transition-colors duration-300">
              <span className="line-clamp-2 leading-tight">{scenario.title}</span>
              {scenario.rateAvg != null && scenario.rateAvg > 0 && (
                <>
                  <span className="ml-2 text-[#dbc21b]">{scenario.rateAvg.toFixed(1)}</span>
                  {scenario.rateCount != null && (
                    <span className="ml-1 text-xs text-muted-foreground">({scenario.rateCount})</span>
                  )}
                </>
              )}
              {action && <div className="ml-auto shrink-0">{action}</div>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full gap-4 overflow-hidden rounded p-2",
          "bg-white/5 transition-all duration-300",
          clickable && "cursor-pointer hover:bg-white/10 [&_.mod-title]:hover:text-primary",
          className
        )}
        {...props}
      >
        {/* Cover image */}
        <div
          className="relative z-[1] mr-4 h-[120px] w-[90px] shrink-0 bg-cover bg-center"
          style={{
            backgroundImage: scenario.coverUrl
              ? `url(${scenario.coverUrl}?width=180&height=240)`
              : undefined,
          }}
        />
        {/* Content */}
        <div className="relative z-[1] min-w-0 flex-1 overflow-hidden">
          <div className="mod-title flex items-center text-base font-bold transition-colors duration-300">
            <span className="line-clamp-1">{scenario.title}</span>
            {scenario.rateAvg != null && scenario.rateAvg > 0 && (
              <>
                <span className="ml-2 text-[#dbc21b]">{scenario.rateAvg.toFixed(1)}</span>
                {scenario.rateCount != null && (
                  <span className="ml-1 text-xs text-muted-foreground">({scenario.rateCount})</span>
                )}
              </>
            )}
            {action && <div className="ml-auto shrink-0">{action}</div>}
          </div>
          {scenario.description && (
            <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
              {scenario.description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ScenarioWidget.displayName = "ScenarioWidget";
