"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MonitorCog, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/shadcn-io/theme-toggle-button";

export function ColorModeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeMode = mounted ? (resolvedTheme ?? theme) : "system";
  const currentTheme = activeMode === 'system' ? 'light' : activeMode as 'light' | 'dark'


  const handleThemeToggle = useCallback(() => {
    const newMode: "dark" | "light" = activeMode === "dark" ? "light" : "dark";

    startTransition(() => {
      setTheme(newMode);
    });
  }, [activeMode, setTheme, startTransition]);

  const dropdownTriggerIcon = useMemo(() => {
    if (activeMode === "dark") {
      return <MoonStar className="h-4 w-4" />;
    }
    if (activeMode === "system") {
      return <MonitorCog className="h-4 w-4" />;
    }
    return <SunMedium className="h-4 w-4" />;
  }, [activeMode]);

  return (
    <>
      <ThemeToggleButton
        theme={currentTheme}
        onClick={handleThemeToggle}
        variant="circle-blur"
        start="top-right"
      />
    </>
  );
}
