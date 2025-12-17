"use client";

import { useTranslation } from "@/lib/i18n/react";
import { Card } from "@/components/ui/card";
import { ScenarioOperationLog } from "@/components/Scenario/ScenarioOperationLog";
import { ScenarioEditForm } from "@/components/Scenario/ScenarioEditForm";
import { ScenarioContributeForm } from "@/components/Scenario/ScenarioContributeForm";
import type { IModDto, ModFilterConfig } from "@dicecho/types";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  lng: string;
  scenario: IModDto;
}

export function ScenarioEditPageClient({ lng, scenario }: Props) {
  const { t } = useTranslation(lng);
  const { api } = useDicecho();
  const router = useRouter();

  const handleUpdate = async (values: Record<string, unknown>) => {
    await api.module.update(scenario._id, {
      ...values,
      playerNumber: [
        (values as any).minPlayer ?? scenario.playerNumber?.[0] ?? 0,
        (values as any).maxPlayer ?? scenario.playerNumber?.[1] ?? 0,
      ],
    });
    toast.success(t("scenario_save_success"));
    router.push(`/${lng}/scenario/${scenario._id}`);
  };

  return (
    <div className="container mt-16 grid grid-cols-6 gap-6 pb-12">
      <div className="col-span-6 space-y-6 lg:col-span-4">
        <Card className="p-6">
          {scenario.isForeign ? (
            <ScenarioContributeForm
              scenario={scenario}
              submitText={t("save")}
              onSubmit={handleUpdate}
            />
          ) : (
            <ScenarioEditForm
              scenario={scenario}
              submitText={t("save")}
              onSubmit={handleUpdate}
            />
          )}
        </Card>
      </div>
      <div className="col-span-6 lg:col-span-2">
        <ScenarioOperationLog scenarioId={scenario._id} />
      </div>
    </div>
  );
}
