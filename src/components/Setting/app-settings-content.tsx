"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useUserTheme } from "@/hooks/use-user-theme";
import { useTranslation } from "@/lib/i18n/react";
import type { ThemePresetId } from "@/types/theme";

interface AppSettingsContentProps {
  lng: string;
}

export function AppSettingsContent({ lng }: AppSettingsContentProps) {
  const { t } = useTranslation();
  const { settings, setRateScoreAvailable, setRateAvailable, setAppMode } =
    useAppSettings();
  const { theme, updateTheme, presets, presetOrder } = useUserTheme();

  const handleThemeChange = (presetId: string) => {
    const preset = presets[presetId as ThemePresetId];
    if (preset) {
      updateTheme(() => ({
        ...preset,
        mode: theme.mode,
      }));
    }
  };

  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {/* Rate Score Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">{t("app_settings_rate_score")}</span>
          <Switch
            checked={settings.rateScoreAvailable}
            onCheckedChange={setRateScoreAvailable}
          />
        </div>

        {/* Rate Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">{t("app_settings_rate")}</span>
          <Switch
            checked={settings.rateAvailable}
            onCheckedChange={setRateAvailable}
          />
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">{t("app_settings_theme")}</span>
          <div className="flex items-center gap-2">
            <Select value={theme.id} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presetOrder.map((presetId) => {
                  const preset = presets[presetId];
                  return (
                    <SelectItem key={presetId} value={presetId}>
                      {preset?.name ?? presetId}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
