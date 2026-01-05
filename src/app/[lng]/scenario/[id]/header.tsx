"use client";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { ScenarioActions } from "@/components/Scenario/scenario-actions";
import { useParams } from "next/navigation";
import { useWindowScroll } from "react-use";
import { cn } from "@/lib/utils";

import type { IModDto } from "@dicecho/types";

export const ScenarioDetailHeader = ({
  title,
  scenario,
}: {
  title: string;
  scenario?: IModDto;
}) => {
  const state = useWindowScroll();
  const { lng } = useParams<{ lng: string }>();

  const y = state.y ?? 0;

  return (
    <MobileHeader
      left={<HeaderBack fallback={`/${lng}/scenario`} />}
      right={
        scenario ? (
          <ScenarioActions scenario={scenario} variant="actionsheet" />
        ) : undefined
      }
      className={cn("fixed items-center justify-center", {
        ["bg-transparent text-primary-foreground shadow-none"]: y < 160,
      })}
    >
      <div className={cn("text-sm text-center", { ["opacity-0"]: y < 160 })}>
        {title}
      </div>
    </MobileHeader>
  );
};
