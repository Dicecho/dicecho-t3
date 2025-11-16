'use client';

import { useCallback, useSyncExternalStore } from "react";
import { applyThemeTokens } from "@/lib/apply-theme";
import {
  defaultTheme as defaultPresetTheme,
  presetThemes,
  THEME_STORAGE_KEY,
  themePresetOrder,
  themeTokenVariableMap,
} from "@/lib/theme/constants";
import type {
  ThemeTokens,
  ThemeUpdateFn,
  ThemeValues,
  UserTheme,
} from "@/types/theme";

export const cloneThemeTokens = (tokens: ThemeTokens): ThemeTokens => ({
  light: { ...tokens.light },
  dark: { ...tokens.dark },
});

export const cloneUserTheme = (theme: UserTheme): UserTheme => ({
  ...theme,
  tokens: cloneThemeTokens(theme.tokens),
});

const tokenKeys = Object.keys(themeTokenVariableMap) as Array<keyof ThemeValues>;

let initialized = false;
let storageListenerRegistered = false;
let currentTheme: UserTheme = cloneUserTheme(defaultPresetTheme);
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const persistTheme = (theme: UserTheme, persist = true) => {
  currentTheme = cloneUserTheme(theme);
  if (typeof document !== "undefined") {
    applyThemeTokens(currentTheme.tokens);
  }

  if (persist && typeof window !== "undefined") {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify(currentTheme),
    );
  }

  notify();
};

const parseTheme = (value: string | null): UserTheme | null => {
  if (!value) {
    return null;
  }

  try {
    const raw = JSON.parse(value) as Partial<UserTheme> & {
      tokens?: Partial<Record<string, unknown>>;
    };

    if (!raw || typeof raw !== "object" || typeof raw.tokens !== "object") {
      return null;
    }

    const parseModeTokens = (modeValue: unknown): ThemeValues | null => {
      if (!modeValue || typeof modeValue !== "object") {
        return null;
      }
      const parsed = {} as ThemeValues;
      for (const key of tokenKeys) {
        const tokenValue = (modeValue as Record<string, unknown>)[key as string];
        if (typeof tokenValue !== "string") {
          return null;
        }
        parsed[key] = tokenValue;
      }
      return parsed;
    };

    const storedTokens = raw.tokens as Partial<Record<string, unknown>>;
    const lightTokens = parseModeTokens(storedTokens.light);
    const darkTokens = parseModeTokens(storedTokens.dark);
    if (!lightTokens || !darkTokens) {
      return null;
    }

    return {
      id: typeof raw.id === "string" ? raw.id : "custom",
      name: typeof raw.name === "string" ? raw.name : "Custom",
      mode: raw.mode === "dark" ? "dark" : "light",
      tokens: {
        light: lightTokens,
        dark: darkTokens,
      },
    };
  } catch {
    return null;
  }
};

const readStoredTheme = (): UserTheme | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return parseTheme(stored);
};

const handleStorageChange = (event: StorageEvent) => {
  if (event.key !== THEME_STORAGE_KEY) {
    return;
  }

  const nextTheme = parseTheme(event.newValue);
  if (!nextTheme) {
    return;
  }

  persistTheme(nextTheme, false);
};

const ensureInitialized = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  if (typeof window === "undefined") {
    currentTheme = cloneUserTheme(defaultPresetTheme);
    return;
  }

  const storedTheme = readStoredTheme();
  if (storedTheme) {
    persistTheme(storedTheme, false);
  } else {
    persistTheme(defaultPresetTheme, true);
  }

  if (!storageListenerRegistered) {
    window.addEventListener("storage", handleStorageChange);
    storageListenerRegistered = true;
  }
};

const updateThemeStore = (updater: ThemeUpdateFn) => {
  const nextTheme = updater(cloneUserTheme(currentTheme));
  persistTheme(nextTheme);
};

export const defaultTheme = cloneUserTheme(defaultPresetTheme);

export function useUserTheme() {
  ensureInitialized();

  const theme = useSyncExternalStore(subscribe, () => currentTheme, () => currentTheme);

  const updateTheme = useCallback(
    (updater: ThemeUpdateFn) => {
      updateThemeStore(updater);
    },
    [],
  );

  return {
    theme,
    updateTheme,
    defaultTheme,
    presets: presetThemes,
    presetOrder: themePresetOrder,
  } as const;
}

export const getCurrentUserTheme = () => currentTheme;

export type UseUserThemeReturn = ReturnType<typeof useUserTheme>;
