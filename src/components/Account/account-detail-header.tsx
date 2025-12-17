'use client';

import { useWindowScroll } from "react-use";
import { MobileHeader } from "../Header/MobileHeader";
import { cn } from "@/lib/utils";

export const AccountDetailHeader = ({ title }: { title: string }) => {
  const state = useWindowScroll();
  const BREAKPOINT = 285;

  const y = state.y ?? 0;

  return (
    <MobileHeader
      left={<div className="h-6"/>}
      className={cn("fixed h-14 items-center justify-center", {
        ["bg-transparent text-primary-foreground shadow-none"]: y < BREAKPOINT,
      })}
    >
      <div className={cn("text-sm text-center", { ["opacity-0"]: y < BREAKPOINT })}>
        {title}
      </div>
    </MobileHeader>
  );
};