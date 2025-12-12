import * as languages from '@cospired/i18n-iso-languages';

// Register locales for browser environment
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'));
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/zh.json'));
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ja.json'));
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ko.json'));

export enum LanguageCodes {
  AF = 'af',
  SQ = 'sq',
  AR = 'ar',
  EU = 'eu',
  BG = 'bg',
  CA = 'ca',
  ZHCN = 'zh-CN',
  ZHTW = 'zh-TW',
  HR = 'hr',
  CS = 'cs',
  DA = 'da',
  NL = 'nl',
  EN = 'en',
  ET = 'et',
  FI = 'fi',
  FR = 'fr',
  DE = 'de',
  EL = 'el',
  HE = 'he',
  HI = 'hi',
  HU = 'hu',
  IS = 'is',
  IN = 'in',
  IT = 'it',
  JA = 'ja',
  KO = 'ko',
  LV = 'lv',
  LT = 'lt',
  MK = 'mk',
  MS = 'ms',
  NO = 'no',
  PL = 'pl',
  PT = 'pt',
  RM = 'rm',
  RO = 'ro',
  RU = 'ru',
  SR = 'sr',
  SL = 'sl',
  SK = 'sk',
  ES = 'es',
  SV = 'sv',
  TR = 'tr',
  TH = 'th',
  VI = 'vi',
}

function getLanguageName(code: string, locale: string): string {
  const normalizedLocale = locale === 'zh' ? 'zh-CN' : locale;
  
  // Handle special cases
  if (code === 'zh-CN') {
    if (locale === 'zh') return '简体中文';
    if (locale === 'ja') return '中国語簡体字';
    if (locale === 'ko') return '중국어 간체';
    return 'Chinese Simplified';
  }
  if (code === 'zh-TW') {
    if (locale === 'zh') return '繁体中文';
    if (locale === 'ja') return '中国語繁体字';
    if (locale === 'ko') return '중국어 번체';
    return 'Chinese Traditional';
  }
  
  // Map 'in' to 'id' for Indonesian (ISO 639-1 uses 'id')
  const normalizedCode = code === 'in' ? 'id' : code;
  
  const name = languages.getName(normalizedCode, normalizedLocale);
  return name || code;
}

function createLanguageMap(locale: string): Record<LanguageCodes, string> {
  const map = {} as Record<LanguageCodes, string>;
  for (const code of Object.values(LanguageCodes)) {
    map[code as LanguageCodes] = getLanguageName(code, locale);
  }
  return map;
}

export const LanguageCodeMap: Record<string, Record<LanguageCodes, string>> = {
  'zh': createLanguageMap('zh'),
  'en': createLanguageMap('en'),
  'ja': createLanguageMap('ja'),
  'ko': createLanguageMap('ko'),
};
