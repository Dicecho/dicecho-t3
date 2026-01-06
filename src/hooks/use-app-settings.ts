"use client";

import { useLocalStorage } from "./useLocalStorage";

export interface AppSettings {
  rateScoreAvailable: boolean;
  rateAvailable: boolean;
  appMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  rateScoreAvailable: true,
  rateAvailable: true,
  appMode: false,
};

export function useAppSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "dicecho-app-settings",
    DEFAULT_SETTINGS
  );

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    settings,
    updateSetting,
    setRateScoreAvailable: (value: boolean) =>
      updateSetting("rateScoreAvailable", value),
    setRateAvailable: (value: boolean) => updateSetting("rateAvailable", value),
    setAppMode: (value: boolean) => updateSetting("appMode", value),
  };
}
