"use client";

import {
  THEME_STORAGE_KEY,
  THEME_STYLE_ELEMENT_ID,
  themeModes,
  themeTokenVariableMap,
} from "@/lib/theme/constants";
import { defaultTheme } from "@/hooks/use-user-theme";

export function ThemeScript() {
  const scriptContent = `(() => {
    try {
      var storageKey = '${THEME_STORAGE_KEY}';
      var styleId = '${THEME_STYLE_ELEMENT_ID}';
      var tokenMap = ${JSON.stringify(themeTokenVariableMap)};
      var tokenKeys = Object.keys(tokenMap);
      var modes = ${JSON.stringify(themeModes)};
      var fallback = ${JSON.stringify(defaultTheme.tokens)};
      var stored = localStorage.getItem(storageKey);
      var parsed = stored ? JSON.parse(stored) : null;
      var tokens = parsed && parsed.tokens ? parsed.tokens : fallback;
      var css = '';

      modes.forEach(function (mode) {
        var modeTokens = tokens[mode] || fallback[mode];
        var declarations = '';
        tokenKeys.forEach(function (key) {
          var cssVar = tokenMap[key];
          var value = modeTokens[key];
          if (typeof value !== 'string') {
            value = fallback[mode][key];
          }
          if (typeof value === 'string') {
            declarations += cssVar + ':' + value + ';';
          }
        });
        if (declarations) {
          css += (mode === 'dark' ? '.dark{' : ':root{') + declarations + '}';
        }
      });

      if (!css) return;

      var styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;
    } catch (error) {
      // ignore
    }
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} suppressHydrationWarning />;
}
