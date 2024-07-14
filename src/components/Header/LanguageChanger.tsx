'use client'
import { Globe } from "lucide-react";
import { SelectContent, SelectItem } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useRouter, usePathname, useParams } from "next/navigation";
import { languages } from '@/lib/i18n/settings'

const LANGUAGE_PREFIXES = languages.map(l => `/${l}`)

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
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ lng: string }>();

  const changeLanguage = (locale: string) => {
    let path = pathname

    LANGUAGE_PREFIXES.forEach((prefix) => {
      if (path.startsWith(prefix)) {
        path = path.replace(prefix, '')
      }
    })

    router.push(`/${locale}${path}`)
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
