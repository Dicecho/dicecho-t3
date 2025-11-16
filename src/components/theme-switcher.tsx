"use client";

import { useEffect, useMemo, useState } from "react";
import { MonitorCog, MoonStar, SunMedium, Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeEditor } from "@/components/theme-editor";
import { cloneUserTheme, useUserTheme } from "@/hooks/use-user-theme";
import type { ThemePresetId } from "@/types/theme";

export function ThemeSwitcher() {
  const { theme: userTheme, updateTheme, presets, presetOrder } = useUserTheme();

  const handlePresetSelect = (presetId: ThemePresetId) => {
    const preset = presets[presetId];
    if (!preset) {
      return;
    }
    updateTheme(() => cloneUserTheme(preset));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 space-y-2">
        <DropdownMenuLabel>Preset Themes</DropdownMenuLabel>
        {presetOrder.map((presetId) => {
          const preset = presets[presetId];
          if (!preset) {
            return null;
          }
          const isActive = userTheme.id === presetId;
          return (
            <DropdownMenuItem
              key={presetId}
              onClick={() => handlePresetSelect(presetId)}
              className="flex items-center"
            >
              <div className="flex gap-0.5">
                <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: preset.tokens.light.primary }} />
                <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: preset.tokens.light.accent }} />
                <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: preset.tokens.light.secondary }} />
                <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: preset.tokens.light.border }} />
              </div>
              <span>{preset.name}</span>
              {isActive ? <Check className="h-4 w-4 ml-auto" /> : null}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
