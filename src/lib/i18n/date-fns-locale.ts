import { enUS, zhCN, ja, ko } from "date-fns/locale";
import type { Locale } from "date-fns";

const localeMap: Record<string, Locale> = {
  en: enUS,
  zh: zhCN,
  ja: ja,
  ko: ko,
};

export function getDateFnsLocale(lng: string): Locale {
  return localeMap[lng] ?? enUS;
}
