"use client";

import type { IModListQuery } from "@dicecho/types";
import { ButtonProps, Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Shuffle } from "lucide-react";
import { useScenarioFilterParams } from "@/components/Scenario/use-scenario-filter-params";

interface RandomButtonProps extends Omit<ButtonProps, "onClick"> {}

export function RandomButton({ ...props }: RandomButtonProps) {
  const router = useRouter();
  const filterQuery = useScenarioFilterParams();
  const { t, i18n } = useTranslation();
  const { api } = useDicecho();

  const { mutateAsync: randomScenario, isPending } = useMutation({
    mutationFn: () => api.module.random(filterQuery),
  });

  const handleRandom = () => {
    randomScenario().then((scenario) => {
      router.push(`/${i18n.language}/scenario/${scenario._id}`);
    });
  };

  return (
    <Button onClick={handleRandom} disabled={isPending} {...props}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Shuffle className="size-4" />
      )}
      {t("random_scenario")}
    </Button>
  );
}
