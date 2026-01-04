"use client";

import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { useParams } from "next/navigation";
import { useWindowScroll } from "react-use";
import { cn } from "@/lib/utils";

export const TagDetailHeader = ({ title }: { title: string }) => {
  const state = useWindowScroll();
  const { lng } = useParams<{ lng: string }>();

  const y = state.y ?? 0;

  return (
    <MobileHeader
      left={<HeaderBack fallback={`/${lng}/scenario`} />}
      className={cn("fixed items-center justify-center", {
        ["bg-transparent text-primary-foreground shadow-none"]: y < 100,
      })}
    >
      <div className={cn("text-center text-sm", { ["opacity-0"]: y < 100 })}>
        {title}
      </div>
    </MobileHeader>
  );
};
