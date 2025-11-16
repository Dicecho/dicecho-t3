import {
  THEME_STYLE_ELEMENT_ID,
  themeModes,
  themeTokenVariableMap,
} from "@/lib/theme/constants";
import type { ThemeMode, ThemeTokens, ThemeValues } from "@/types/theme";

const tokenKeys = Object.keys(themeTokenVariableMap) as Array<keyof ThemeValues>;

const buildCSSBlock = (mode: ThemeMode, values: ThemeValues) => {
  const selector = mode === "dark" ? ".dark" : ":root";
  const declarations = tokenKeys
    .map((key) => `${themeTokenVariableMap[key]}:${values[key]};`)
    .join("");
  return `${selector}{${declarations}}`;
};

export const applyThemeTokens = (tokens: ThemeTokens) => {
  if (typeof document === "undefined") {
    return;
  }

  const styleId = THEME_STYLE_ELEMENT_ID;
  let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  const css = themeModes
    .map((mode) => buildCSSBlock(mode, tokens[mode]))
    .join("\n");
  styleElement.textContent = css;
};
