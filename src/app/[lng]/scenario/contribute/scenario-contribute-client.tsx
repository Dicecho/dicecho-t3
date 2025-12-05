"use client";

import { ScenarioContributeForm } from "@/components/Scenario/ScenarioContributeForm";
import type { ModFilterConfig } from "@dicecho/types";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  lng: string;
  config: ModFilterConfig;
}

export function ScenarioContributePageClient({ lng, config }: Props) {
  const { t } = useTranslation(lng);
  const { api } = useDicecho();
  const router = useRouter();

  return (
    <div className="container mx-auto mt-16 max-w-4xl px-4 pb-12">
      <Card className="p-6">
        <ScenarioContributeForm
          config={config}
          submitText={t("scenario_upload")}
          onSubmit={async (values) => {
            const created = await api.module.contribute({
              ...values,
              playerNumber: [values.minPlayer ?? 0, values.maxPlayer ?? 0],
            });
            toast.success(t("scenario_create_success"));
            router.push(`/${lng}/scenario/${created._id}`);
          }}
        />
      </Card>
    </div>
  );
}
