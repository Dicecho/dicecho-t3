'use client'
import { Globe } from "lucide-react";
import { SelectContent, SelectItem } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useRouter, useParams } from "next/navigation";
import { usePurePathname } from '@/hooks/usePurePathname'

const LanguageKey = {
  en: "en",
  zh: "zh",
  ja: "ja",
} as const;

const LanguageLabel = {
  [LanguageKey.en]: "English",
  [LanguageKey.zh]: "简体中文",
  [LanguageKey.ja]: "日本語",
};

export const LanguageChanger = () => {
  const purePathname = usePurePathname();
  const router = useRouter();
  const params = useParams<{ lng: string }>();

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}${purePathname}`)
  };

  return (
    <SelectPrimitive.Root value={params.lng} onValueChange={(value) => changeLanguage(value)}>
      <SelectPrimitive.Trigger asChild>
        <Globe className="cursor-pointer" size={24} />
      </SelectPrimitive.Trigger>

      <SelectContent position="popper" side="bottom" align="end">
        {Object.keys(LanguageKey).map((lng) => (
          <SelectItem key={lng} value={lng}>
            {LanguageLabel[lng as keyof typeof LanguageKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
