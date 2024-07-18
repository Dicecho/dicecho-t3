"use client";

import { useTheme } from "@/lib/theme/react";
import { Sun, Moon } from "lucide-react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as SelectPrimitive from "@radix-ui/react-select";

const LIGHT_THEMES = ["light"];
const DARK_THEMES = ["dark", "dicecho"];

const THEMES = [...LIGHT_THEMES, ...DARK_THEMES];

export const ThemeChanger = (props: { initialTheme: string }) => {
  const { theme, setTheme } = useTheme(props.initialTheme);

  return (
    <Select defaultValue={theme} onValueChange={(t) => setTheme(t)}>
      <SelectPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon">
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
              className="border-box bg-base-100 text-foreground "
            >
              <div className="flex h-full w-full items-center gap-1">
                <div className="mr-auto">{theme}</div>
                <div className="h-4 w-2 rounded bg-primary" />
                <div className="h-4 w-2 rounded bg-secondary" />
                <div className="h-4 w-2 rounded bg-accent" />
                <div className="h-4 w-2 rounded bg-muted" />
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};
