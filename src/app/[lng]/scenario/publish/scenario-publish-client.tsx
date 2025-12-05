"use client";

import { ScenarioEditForm } from "@/components/Scenario/ScenarioEditForm";
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

export function ScenarioPublishPageClient({ lng, config }: Props) {
  const { t } = useTranslation(lng);
  const { api } = useDicecho();
  const router = useRouter();

  return (
    <div className="container mx-auto mt-16 max-w-4xl px-4 pb-12">
      <Card className="p-6">
        <ScenarioEditForm
          config={config}
          submitText={t("scenario_upload")}
          onSubmit={async (values) => {
            const created = await api.module.publish({
              ...values,
              playerNumber: [values.minPlayer ?? 0, values.maxPlayer ?? 0],
              modFiles: values.modFiles?.map((file) => ({
                name: file.name,
                size: file.size ?? 0,
                url: file.url,
                type: file.type ?? "",
              })) ?? [],
            });
            toast.success(t("scenario_create_success"));
            router.push(`/${lng}/scenario/${created._id}`);
          }}
        />
      </Card>
    </div>
  );
}
