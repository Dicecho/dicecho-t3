"use client";

import { ScenarioEditForm } from "@/components/Scenario/ScenarioEditForm";
import type { ModFilterConfig } from "@dicecho/types";
import { Card } from "@/components/ui/card";
import { Alert, AlertContent, AlertIcon, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/lib/i18n/react";
import { Trans } from "react-i18next";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload } from "lucide-react";

interface Props {
  lng: string;
}

export function ScenarioPublishPageClient({ lng }: Props) {
  const { t } = useTranslation(lng);
  const { api } = useDicecho();
  const router = useRouter();

  return (
    <div className="container mt-16 pb-12">
      <Alert variant="warning" appearance="outline" className="mb-4">
        <AlertIcon>
          <Upload />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>{t("scenario_publish_alert_title")}</AlertTitle>
          <AlertDescription>
            <Trans
              i18nKey="scenario_publish_alert_desc"
              t={t}
              components={[
                <Link href={`/${lng}/scenario/contribute`} className="underline font-medium text-primary" />,
              ]}
            />
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Card className="p-6">
        <ScenarioEditForm
          submitText={t("publish_scenario")}
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
