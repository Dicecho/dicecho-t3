"use client";

import { useState } from "react";
import { EditIcon, HeartIcon, StarIcon } from "lucide-react";
import { useAuthAction } from "@/components/Auth/use-auth-action";
import { RateEditDialog } from "@/components/Rate/RateEditDialog";
import { Button } from "@/components/ui/button";
import { useScenarioRate } from "@/hooks/use-scenario-rate";
import { useTranslation } from "@/lib/i18n/react";

interface ScenarioRateActionsProps {
  scenarioId: string;
}

export function ScenarioRateActions({
  scenarioId,
}: ScenarioRateActionsProps): React.ReactElement {
  const { t } = useTranslation();
  const {
    myRate,
    isLoading,
    isRated,
    isMarked,
    mark,
    deleteRate,
    isDeleting,
    invalidate,
  } = useScenarioRate(scenarioId);
  const { requireAuth, AuthDialogPortal } = useAuthAction();

  const [rateDialogOpen, setRateDialogOpen] = useState(false);

  const openRateDialog = requireAuth(() => setRateDialogOpen(true));

  const handleMarkClick = requireAuth(() => {
    if (myRate) {
      setRateDialogOpen(true);
      return;
    } 

    mark();
  });

  const RateIcon = isRated ? EditIcon : StarIcon;

  return (
    <>
      <Button
        variant="outline"
        color="primary"
        onClick={openRateDialog}
        disabled={!isRated && isLoading}
      >
        <RateIcon size={16} />
        {isRated ? t("rated") : t("rate")}
      </Button>

      <Button
        variant={isMarked ? "default" : "outline"}
        color="primary"
        onClick={handleMarkClick}
        disabled={isLoading}
      >
        <HeartIcon size={16} className={isMarked ? "fill-current" : ""} />
        {isMarked ? t("marked") : t("mark")}
      </Button>

      <RateEditDialog
        modId={scenarioId}
        rate={myRate ?? undefined}
        open={rateDialogOpen}
        onOpenChange={setRateDialogOpen}
        onSuccess={invalidate}
        onDelete={deleteRate}
        isDeleting={isDeleting}
      />

      <AuthDialogPortal />
    </>
  );
}
