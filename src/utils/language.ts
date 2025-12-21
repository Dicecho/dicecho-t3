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

export const map639_3to1: Record<string, LanguageCodes> = {
  'eng': LanguageCodes.EN, // English
  'cmn': LanguageCodes.ZHCN, // Mandarin Chinese
  'zho': LanguageCodes.ZHCN, // Chinese (Macro)
  'spa': LanguageCodes.ES, // Spanish
  'rus': LanguageCodes.RU, // Russian
  'fra': LanguageCodes.FR, // French
  'deu': LanguageCodes.DE, // German
  'jpn': LanguageCodes.JA, // Japanese
  'kor': LanguageCodes.KO, // Korean
  'por': LanguageCodes.PT, // Portuguese
  'ita': LanguageCodes.IT, // Italian
  'ara': LanguageCodes.AR, // Arabic
  'hin': LanguageCodes.HI, // Hindi
  'vie': LanguageCodes.VI, // Vietnamese
  'tur': LanguageCodes.TR, // Turkish
  'nld': LanguageCodes.NL, // Dutch
  'pol': LanguageCodes.PL, // Polish
  'tha': LanguageCodes.TH, // Thai
};

export function getIso639_1Code(iso639_3code: string): LanguageCodes | null {
  return map639_3to1[iso639_3code] || null;
}

export function isDifferentLanguage(iso639_3code: string | null, targetLang: string): boolean {
  if (!iso639_3code) {
    return false;
  }
  const langCode = getIso639_1Code(iso639_3code);
  if (!langCode) {
    return false;
  }
  return !langCode.startsWith(targetLang);
}