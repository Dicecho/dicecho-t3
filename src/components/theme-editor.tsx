"use client";

import { useState, type ReactNode } from "react";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneUserTheme, useUserTheme } from "@/hooks/use-user-theme";
import type { ThemeMode, ThemeValues } from "@/types/theme";

type ThemeEditorProps = {
  trigger?: ReactNode;
};

const editableTokenFields: Array<{
  key: keyof ThemeValues;
  label: string;
  placeholder?: string;
}> = [
  { key: "primary", label: "Primary", placeholder: "oklch(...) or #hex" },
  {
    key: "primaryForeground",
    label: "Primary Foreground",
    placeholder: "Text color for primary",
  },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "radius", label: "Radius (e.g. 0.5rem)" },
];

const ensureCustomIdentity = (themeId: string) =>
  themeId === "custom" ? themeId : "custom";

export function ThemeEditor({ trigger }: ThemeEditorProps) {
  const { theme, updateTheme, defaultTheme } = useUserTheme();
  const [open, setOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<ThemeMode>("light");

  const handleTokenChange = (
    mode: ThemeMode,
    key: keyof ThemeValues,
    value: string,
  ) => {
    updateTheme((prev) => ({
      ...prev,
      id: ensureCustomIdentity(prev.id),
      name: prev.id === "custom" ? prev.name : "Custom Theme",
      tokens: {
        ...prev.tokens,
        [mode]: {
          ...prev.tokens[mode],
          [key]: value,
        },
      },
    }));
  };

  const handleReset = () => {
    updateTheme(() => cloneUserTheme(defaultTheme));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="icon">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Open theme editor</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Theme editor</DialogTitle>
          <DialogDescription>
            Adjust base tokens to personalize the UI. Changes are applied immediately
            and stored locally for future visits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-theme-name">Theme name</Label>
            <Input
              id="user-theme-name"
              value={theme.name}
              onChange={(event) =>
                updateTheme((prev) => ({
                  ...prev,
                  id: ensureCustomIdentity(prev.id),
                  name: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Editing mode
            </span>
            <div className="flex gap-2">
              {(["light", "dark"] as ThemeMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={editingMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditingMode(mode)}
                >
                  {mode === "light" ? "Light" : "Dark"}
                </Button>
              ))}
            </div>
          </div>
          {editableTokenFields.map((field) => (
            <div className="flex flex-col gap-2" key={field.key}>
              <Label htmlFor={`theme-token-${field.key}`}>{field.label}</Label>
              <Input
                id={`theme-token-${field.key}`}
                value={theme.tokens[editingMode][field.key]}
                placeholder={field.placeholder}
                onChange={(event) =>
                  handleTokenChange(editingMode, field.key, event.target.value)
                }
              />
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={handleReset}>
              Reset to default
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
