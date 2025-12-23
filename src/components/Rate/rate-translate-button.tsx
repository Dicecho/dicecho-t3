"use client";

import { Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { api } from "@/trpc/react";
import { LanguageCodes } from "@/utils/language";
import type { TranslationResult } from "./use-rate-translation";

interface RateTranslateButtonProps {
  rateId: string;
  isTranslated: boolean;
  onTranslated: (result: TranslationResult) => void;
  onToggle: () => void;
}

export function RateTranslateButton({
  rateId,
  isTranslated,
  onTranslated,
  onToggle,
}: RateTranslateButtonProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as LanguageCodes ?? LanguageCodes.EN;

  const translateMutation = api.rate.translate.useMutation({
    onSuccess: (data) => {
      onTranslated({
        translatedText: data.translatedText,
      });
    },
  });

  const handleClick = () => {
    if (isTranslated) {
      onToggle();
      return;
    }

    translateMutation.mutate({
      rateId,
      targetLanguage: currentLanguage,
    });
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleClick}
      disabled={translateMutation.isPending}
      className="gap-2"
    >
      {translateMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      <span>
        {isTranslated
          ? t("Rate.show_original")
          : t("Rate.translate_to", { language: t(`language_codes.${currentLanguage}`) })}
      </span>
    </Button>
  );
}
