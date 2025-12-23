"use client";

import { Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { LanguageCodes } from "@/utils/language";

export interface TranslationResult {
  translatedText: string;
}

interface RateTranslateButtonProps {
  rateId: string;
  hasContent: boolean;
  isTranslated: boolean;
  onTranslated: (result: TranslationResult) => void;
  onToggle: () => void;
}

export function RateTranslateButton({
  rateId,
  hasContent,
  isTranslated,
  onTranslated,
  onToggle,
}: RateTranslateButtonProps) {
  const { t } = useTranslation();
  const params = useParams<{ lng: LanguageCodes }>();
  const currentLanguage = params.lng ?? LanguageCodes.EN;

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

  if (!hasContent) {
    return null;
  }

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
