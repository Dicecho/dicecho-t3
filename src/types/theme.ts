export type ThemeMode = "light" | "dark";

export type ThemePresetId = string;

export type ThemePresetStyles = {
  light: Partial<Record<string, string>>;
  dark: Partial<Record<string, string>>;
};

export type ThemePreset = {
  label?: string;
  createdAt?: string;
  styles: ThemePresetStyles;
};

export type ThemeValues = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  radius: string;
  shadowX: string;
  shadowY: string;
  shadowBlur: string;
  shadowSpread: string;
  shadowOpacity: string;
  shadowColor: string;
  shadow2xs: string;
  shadowXs: string;
  shadowSm: string;
  shadow: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
  trackingNormal: string;
  spacing: string;
  shadowOffsetX: string;
  shadowOffsetY: string;
  letterSpacing: string;
};

export type ThemeTokens = Record<ThemeMode, ThemeValues>;

export type UserTheme = {
  id: string;
  name: string;
  mode: ThemeMode;
  tokens: ThemeTokens;
};

export type ThemeUpdateFn = (theme: UserTheme) => UserTheme;
