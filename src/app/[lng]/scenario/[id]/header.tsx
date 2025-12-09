"use client";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { useParams } from "next/navigation";
import { useWindowScroll } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

export const ScenarioDetailHeader = ({ title }: { title: string }) => {
  const [state] = useWindowScroll();
  const { lng } = useParams<{ lng: string }>();

  const y = state.y ?? 0;

  return (
    <MobileHeader
      left={<HeaderBack fallback={`/${lng}/scenario`}/>}
      className={cn("fixed items-center justify-center", {
        ["bg-transparent text-primary-foreground shadow-none"]: y < 160,
      })}
    >
      <div className={cn("text-sm", { ["opacity-0"]: y < 160 })}>
        {title}
      </div>
    </MobileHeader>
  );
};
