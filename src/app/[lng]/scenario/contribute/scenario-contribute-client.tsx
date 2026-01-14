"use client";

import { ScenarioContributeForm } from "@/components/Scenario/ScenarioContributeForm";
import type { ModFilterConfig } from "@dicecho/types";
import { Card } from "@/components/ui/card";
import {
  Alert,
  AlertContent,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { useTranslation } from "@/lib/i18n/react";
import { Trans } from "react-i18next";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { trackScenarioContribute } from "@/lib/analytics";

interface Props {
  lng: string;
}

export function ScenarioContributePageClient({ lng }: Props) {
  const { t } = useTranslation(lng);
  const { api } = useDicecho();
  const router = useRouter();

  return (
    <div className="container mt-16 pb-12">
      <Alert variant="warning" appearance="outline" className="mb-4">
        <AlertIcon>
          <Users />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>{t("scenario_contribute_alert_title")}</AlertTitle>
          <AlertDescription>
            <Trans
              i18nKey="scenario_contribute_alert_desc"
              t={t}
              components={[
                <Link
                  key="link"
                  href={`/${lng}/scenario/publish`}
                  className="underline font-medium text-primary cursor-pointer"
                />,
              ]}
            />
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Card className="p-6">
        <ScenarioContributeForm
          submitText={t("contribute_community_scenario")}
          onSubmit={async (values) => {
            const created = await api.module.contribute({
              ...values,
              playerNumber: [values.minPlayer ?? 0, values.maxPlayer ?? 0],
            });
            trackScenarioContribute(created._id);
            toast.success(t("scenario_create_success"));
            router.push(`/${lng}/scenario/${created._id}`);
          }}
        />
      </Card>
    </div>
  );
}
