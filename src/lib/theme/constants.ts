import type {
  ThemeMode,
  ThemePreset,
  ThemePresetId,
  ThemeTokens,
  ThemeValues,
  UserTheme,
} from "@/types/theme";
import { defaultPresets } from "@/lib/theme/theme-presets";

export const THEME_STORAGE_KEY = "dicecho:user-theme";
export const THEME_STYLE_ELEMENT_ID = "dicecho-theme-style";

export const themeModes: ThemeMode[] = ["light", "dark"];

export const themeTokenVariableMap: Record<keyof ThemeValues, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
  fontSans: "--font-sans",
  fontSerif: "--font-serif",
  fontMono: "--font-mono",
  radius: "--radius",
  shadowX: "--shadow-x",
  shadowY: "--shadow-y",
  shadowBlur: "--shadow-blur",
  shadowSpread: "--shadow-spread",
  shadowOpacity: "--shadow-opacity",
  shadowColor: "--shadow-color",
  shadow2xs: "--shadow-2xs",
  shadowXs: "--shadow-xs",
  shadowSm: "--shadow-sm",
  shadow: "--shadow",
  shadowMd: "--shadow-md",
  shadowLg: "--shadow-lg",
  shadowXl: "--shadow-xl",
  shadow2xl: "--shadow-2xl",
  trackingNormal: "--tracking-normal",
  spacing: "--spacing",
  shadowOffsetX: "--shadow-offset-x",
  shadowOffsetY: "--shadow-offset-y",
  letterSpacing: "--letter-spacing",
};

const baseLightValues: ThemeValues = {
  background: "oklch(0.9818 0.0054 95.0986)",
  foreground: "oklch(0.3438 0.0269 95.7226)",
  card: "oklch(0.9818 0.0054 95.0986)",
  cardForeground: "oklch(0.1908 0.0020 106.5859)",
  popover: "oklch(1.0000 0 0)",
  popoverForeground: "oklch(0.2671 0.0196 98.9390)",
  primary: "oklch(0.6171 0.1375 39.0427)",
  primaryForeground: "oklch(1.0000 0 0)",
  secondary: "oklch(0.9245 0.0138 92.9892)",
  secondaryForeground: "oklch(0.4334 0.0177 98.6048)",
  muted: "oklch(0.9341 0.0153 90.2390)",
  mutedForeground: "oklch(0.6059 0.0075 97.4233)",
  accent: "oklch(0.9245 0.0138 92.9892)",
  accentForeground: "oklch(0.2671 0.0196 98.9390)",
  destructive: "oklch(0.1908 0.0020 106.5859)",
  destructiveForeground: "oklch(1.0000 0 0)",
  border: "oklch(0.8847 0.0069 97.3627)",
  input: "oklch(0.7621 0.0156 98.3528)",
  ring: "oklch(0.6171 0.1375 39.0427)",
  chart1: "oklch(0.5583 0.1276 42.9956)",
  chart2: "oklch(0.6898 0.1581 290.4107)",
  chart3: "oklch(0.8816 0.0276 93.1280)",
  chart4: "oklch(0.8822 0.0403 298.1792)",
  chart5: "oklch(0.5608 0.1348 42.0584)",
  sidebar: "oklch(0.9663 0.0080 98.8792)",
  sidebarForeground: "oklch(0.3590 0.0051 106.6524)",
  sidebarPrimary: "oklch(0.6171 0.1375 39.0427)",
  sidebarPrimaryForeground: "oklch(0.9881 0 0)",
  sidebarAccent: "oklch(0.9245 0.0138 92.9892)",
  sidebarAccentForeground: "oklch(0.3250 0 0)",
  sidebarBorder: "oklch(0.9401 0 0)",
  sidebarRing: "oklch(0.7731 0 0)",
  fontSans:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSerif:
    "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  radius: "0.5rem",
  shadowX: "0px",
  shadowY: "3px",
  shadowBlur: "3px",
  shadowSpread: "0px",
  shadowOpacity: "0.1",
  shadowColor: "oklch(0 0 0)",
  shadow2xs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  shadowXs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  shadowSm:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadow:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadowMd:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
  shadowLg:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
  shadowXl:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
  shadow2xl: "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
  trackingNormal: "0em",
  spacing: "0.25rem",
  shadowOffsetX: "0",
  shadowOffsetY: "1px",
  letterSpacing: "0em",
};

const baseDarkValues: ThemeValues = {
  background: "oklch(0.2679 0.0036 106.6427)",
  foreground: "oklch(0.8074 0.0142 93.0137)",
  card: "oklch(0.2679 0.0036 106.6427)",
  cardForeground: "oklch(0.9818 0.0054 95.0986)",
  popover: "oklch(0.3085 0.0035 106.6039)",
  popoverForeground: "oklch(0.9211 0.0040 106.4781)",
  primary: "oklch(0.6724 0.1308 38.7559)",
  primaryForeground: "oklch(1.0000 0 0)",
  secondary: "oklch(0.9818 0.0054 95.0986)",
  secondaryForeground: "oklch(0.3085 0.0035 106.6039)",
  muted: "oklch(0.2213 0.0038 106.7070)",
  mutedForeground: "oklch(0.7713 0.0169 99.0657)",
  accent: "oklch(0.2130 0.0078 95.4245)",
  accentForeground: "oklch(0.9663 0.0080 98.8792)",
  destructive: "oklch(0.6368 0.2078 25.3313)",
  destructiveForeground: "oklch(1.0000 0 0)",
  border: "oklch(0.3618 0.0101 106.8928)",
  input: "oklch(0.4336 0.0113 100.2195)",
  ring: "oklch(0.6724 0.1308 38.7559)",
  chart1: "oklch(0.5583 0.1276 42.9956)",
  chart2: "oklch(0.6898 0.1581 290.4107)",
  chart3: "oklch(0.2130 0.0078 95.4245)",
  chart4: "oklch(0.3074 0.0516 289.3230)",
  chart5: "oklch(0.5608 0.1348 42.0584)",
  sidebar: "oklch(0.2357 0.0024 67.7077)",
  sidebarForeground: "oklch(0.8074 0.0142 93.0137)",
  sidebarPrimary: "oklch(0.3250 0 0)",
  sidebarPrimaryForeground: "oklch(0.9881 0 0)",
  sidebarAccent: "oklch(0.1680 0.0020 106.6177)",
  sidebarAccentForeground: "oklch(0.8074 0.0142 93.0137)",
  sidebarBorder: "oklch(0.9401 0 0)",
  sidebarRing: "oklch(0.7731 0 0)",
  fontSans:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSerif:
    "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  radius: "0.5rem",
  shadowX: "0px",
  shadowY: "3px",
  shadowBlur: "3px",
  shadowSpread: "0px",
  shadowOpacity: "0.1",
  shadowColor: "oklch(0 0 0)",
  shadow2xs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  shadowXs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  shadowSm:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadow:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadowMd:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
  shadowLg:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
  shadowXl:
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
  shadow2xl: "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
  trackingNormal: "0em",
  spacing: "0.25rem",
  shadowOffsetX: "0",
  shadowOffsetY: "1px",
  letterSpacing: "0em",
};

const cssVarNameToTokenKey = Object.entries(themeTokenVariableMap).reduce(
  (acc, [tokenKey, cssVariable]) => {
    const normalizedVar = cssVariable.replace(/^--/, "");
    acc[normalizedVar] = tokenKey as keyof ThemeValues;
    return acc;
  },
  {} as Record<string, keyof ThemeValues>
);

const applyPresetStyles = (
  styles: Partial<Record<string, string>> | undefined,
  base: ThemeValues
): ThemeValues => {
  const result: ThemeValues = { ...base };
  if (!styles) {
    return result;
  }

  Object.entries(styles).forEach(([rawKey, value]) => {
    if (typeof value !== "string") {
      return;
    }
    const normalizedKey = rawKey.startsWith("--") ? rawKey.slice(2) : rawKey;
    const tokenKey = cssVarNameToTokenKey[normalizedKey];
    if (tokenKey) {
      result[tokenKey] = value;
    }
  });

  return result;
};

const formatPresetName = (id: string, preset: ThemePreset) => {
  if (preset.label) {
    return preset.label;
  }
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const createThemeFromPreset = (id: ThemePresetId, preset: ThemePreset): UserTheme => ({
  id,
  name: formatPresetName(id, preset),
  mode: "light",
  tokens: {
    light: applyPresetStyles(preset.styles.light, baseLightValues),
    dark: applyPresetStyles(preset.styles.dark, baseDarkValues),
  },
});

const presetEntries: Array<[ThemePresetId, UserTheme]> = Object.entries(defaultPresets).map(
  ([id, preset]) => [
    id as ThemePresetId,
    createThemeFromPreset(id as ThemePresetId, preset),
  ]
);

export const presetThemes = Object.fromEntries(presetEntries) as Record<
  ThemePresetId,
  UserTheme
>;

const defaultPresetId = "modern-minimal" satisfies ThemePresetId;

export const themePresetOrder: ThemePresetId[] = presetEntries.map(
  ([id]) => id as ThemePresetId
);

const fallbackDefaultTheme = (() => {
  const presetDefinition = defaultPresets[defaultPresetId];
  if (presetDefinition) {
    return createThemeFromPreset(defaultPresetId, presetDefinition);
  }
  return presetEntries[0]?.[1];
})();

const createEmptyStyleRecord = (): Partial<Record<string, string>> => ({});

const resolveDefaultTheme = (): UserTheme => {
  const presetTheme = presetThemes[defaultPresetId];
  if (presetTheme) {
    return presetTheme;
  }
  if (fallbackDefaultTheme) {
    return fallbackDefaultTheme;
  }
  return createThemeFromPreset(defaultPresetId, {
    label: "Default",
    styles: { light: createEmptyStyleRecord(), dark: createEmptyStyleRecord() },
  });
};

export const defaultTheme: UserTheme = resolveDefaultTheme();

export const defaultTokens: ThemeTokens = defaultTheme.tokens;
