"use client";

import { useEffect, useMemo, useState } from "react";
import { MonitorCog, MoonStar, SunMedium, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const modeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export function ColorModeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeMode = mounted ? (resolvedTheme ?? theme) : "system";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {dropdownTriggerIcon}
          <span className="sr-only">Change color mode</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 space-y-2">
        <DropdownMenuLabel>Color mode</DropdownMenuLabel>
        {modeOptions.map((option) => {
          const isActive = activeMode === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="flex items-center justify-between"
            >
              <span>{option.label}</span>
              {isActive ? <Check className="ml-auto h-4 w-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
