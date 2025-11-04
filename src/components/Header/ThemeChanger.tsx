"use client";

import { Sun, Moon } from "lucide-react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as SelectPrimitive from "@radix-ui/react-select";
import { DARK_THEMES, THEMES } from "@/lib/theme/constants";

export const ThemeChanger = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  return (
    <Select
      defaultValue={theme}
      onValueChange={(t) => {
        setTheme(t);
      }}
    >
      <SelectPrimitive.Trigger asChild>
        <Button variant="outline" size="icon">
          {DARK_THEMES.some((t) => t === theme) ? <Moon /> : <Sun />}
        </Button>
      </SelectPrimitive.Trigger>

      <SelectContent position="popper" side="bottom" align="end">
        <div className="flex flex-col gap-2">
          {THEMES.map((theme) => (
            <SelectItem
              data-theme={theme}
              key={theme}
              value={theme}
              className="border-w-box bg-base-100 text-foreground "
            >
              <div className="flex h-full w-full items-center gap-1">
                <div className="mr-auto">{theme}</div>
                <div className="bg-primary h-4 w-2 rounded" />
                <div className="bg-secondary h-4 w-2 rounded" />
                <div className="bg-accent h-4 w-2 rounded" />
                <div className="bg-muted h-4 w-2 rounded" />
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};
