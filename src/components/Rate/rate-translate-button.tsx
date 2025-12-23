"use client";

import { Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";

interface RateTranslateButtonProps {
  isTranslated: boolean;
  isTranslating: boolean;
  targetLanguage: string;
  onTranslate: () => void;
}

export function RateTranslateButton({
  isTranslated,
  isTranslating,
  targetLanguage,
  onTranslate,
}: RateTranslateButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={onTranslate}
      disabled={isTranslating}
      className="gap-2"
    >
      {isTranslating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      <span>
        {isTranslated
          ? t("Rate.show_original")
          : t("Rate.translate_to", { language: t(`language_codes.${targetLanguage}`) })}
      </span>
    </Button>
  );
}
