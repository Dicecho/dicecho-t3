"use client";

import { useState, useMemo } from "react";
import { franc } from "franc-min";
import { RemarkContentType } from "@dicecho/types";
import type { IRateDto } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import { isDifferentLanguage, LanguageCodes } from "@/utils/language";
import { api } from "@/trpc/react";

export interface TranslationResult {
  translatedText: string;
}

export function useRateTranslation(rate: IRateDto) {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const targetLanguage = (language as LanguageCodes) ?? LanguageCodes.EN;

  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const translateMutation = api.rate.translate.useMutation({
    onSuccess: (data) => {
      setTranslation({ translatedText: data.translatedText });
      setShowTranslation(true);
    },
  });

  const detectedLang = useMemo(() => {
    if (rate.remarkLength === 0) {
      return null;
    }

    let rateContent = "";
    if (rate.remarkType === RemarkContentType.Markdown) {
      rateContent = rate.remark || "";
    } else if (rate.remarkType === RemarkContentType.Richtext) {
      const texts: string[] = [];
      const traverse = (nodes: unknown[]) => {
        nodes.forEach((node) => {
          const n = node as Record<string, unknown>;
          if (typeof n.text === "string") {
            texts.push(n.text);
          }
          if (typeof n.summary === "string") {
            texts.push(n.summary);
          }
          if (n.children && Array.isArray(n.children)) {
            traverse(n.children);
          }
        });
      };
      traverse(rate.richTextState || []);
      rateContent = texts.join(" ");
    }

    return franc(rateContent, { minLength: 3 });
  }, [rate.remarkLength, rate.remarkType, rate.remark, rate.richTextState]);

  const showTranslateButton = useMemo(() => {
    if (rate.remarkLength === 0) {
      return false;
    }
    return isDifferentLanguage(detectedLang, language);
  }, [rate.remarkLength, detectedLang, language]);

  const isTranslated = showTranslation && translation !== null;
  const isTranslating = translateMutation.isPending;

  const translate = () => {
    if (isTranslated) {
      setShowTranslation((prev) => !prev);
      return;
    }
    translateMutation.mutate({
      rateId: rate._id,
      targetLanguage,
    });
  };

  return {
    translation,
    showTranslation,
    showTranslateButton,
    isTranslated,
    isTranslating,
    translate,
    targetLanguage,
  };
}
