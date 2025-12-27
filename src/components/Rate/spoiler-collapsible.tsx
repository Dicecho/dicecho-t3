"use client";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SpoilerCollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export const SpoilerCollapsible: React.FC<SpoilerCollapsibleProps> = ({
  title,
  children,
}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger
        asChild
        className={cn(
          "border-border/50 overflow-hidden rounded border",
          "bg-muted/30 dark:bg-muted/20"
        )}
      >
        <div
          className={cn(
            "min-h-10",
            "cursor-pointer px-4 py-2",
            "text-foreground font-medium",
            "bg-[linear-gradient(45deg,rgba(234,192,69,0.3)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.3)_50%,rgba(234,192,69,0.3)_75%,transparent_75%,transparent)]",
            "dark:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))]",
            "bg-size-[40px_40px]",
            "hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,transparent_75%,transparent)]",
            "dark:hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.5)_25%,rgba(0,0,0,0.4)_25%,rgba(0,0,0,0.4)_50%,rgba(234,192,69,0.5)_50%,rgba(234,192,69,0.5)_75%,rgba(0,0,0,0.4)_75%,rgba(0,0,0,0.4))]",
            "transition-colors",
            "[&::-webkit-details-marker]:hidden",
            "flex items-center gap-2 pl-6",
            "relative",
            'before:absolute before:top-1/2 before:left-2 before:-translate-y-1/2 before:content-[""]',
            "before:h-0 before:w-0",
            "before:border-t-[5px] before:border-b-[5px] before:border-t-transparent before:border-b-transparent",
            "before:border-l-foreground/60 before:border-l-[5px]",
            "before:transition-transform before:duration-200",
            "data-[state=open]:before:rotate-90",
            "[&_p]:m-0"
          )}
        >
          {title}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "p-4",
          "bg-muted/50 dark:bg-muted/30",
          "border-border/30 border-t",
          "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
