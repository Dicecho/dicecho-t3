"use client";

import { useParams } from "next/navigation";

import { HeaderBack } from "@/components/Header/HeaderBack";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { ScenarioActions } from "@/components/Scenario/scenario-actions";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

import type { IModDto } from "@dicecho/types";

interface ScenarioDetailHeaderProps {
  title: string;
  scenario?: IModDto;
}

export function ScenarioDetailHeader({
  title,
  scenario,
}: ScenarioDetailHeaderProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <div ref={ref} className="absolute top-[200px] h-px w-full md:hidden" />

      <MobileHeader
        left={<HeaderBack fallback={`/${lng}/scenario`} />}
        right={
          scenario && (
            <ScenarioActions scenario={scenario} variant="actionsheet" />
          )
        }
        className={cn(
          "fixed items-center justify-center transition-colors duration-200",
          isIntersecting && "bg-transparent text-primary-foreground shadow-none",
        )}
      >
        <div
          className={cn(
            "text-center text-sm transition-opacity duration-200",
            isIntersecting && "opacity-0",
          )}
        >
          {title}
        </div>
      </MobileHeader>
    </>
  );
}
