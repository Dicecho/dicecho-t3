"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type PendantProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    url?: string;
  }
>;

export function Pendant({
  url,
  children,
  className,
  ...props
}: PendantProps) {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      {url && url !== "" && (
        <span
          className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] pointer-events-none bg-center bg-cover z-1"
          style={{ backgroundImage: `url(${url})` }}
        />
      )}
      {children}
    </span>
  );
}
