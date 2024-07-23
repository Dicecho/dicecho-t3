"use client";

import React from "react";

import { cn, withRef } from "@udecode/cn";

import type { TColor } from "./color-dropdown-menu";

import { buttonVariants } from "@/components/ui/button";
import { ColorDropdownMenuItems } from "./color-dropdown-menu-items";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/react";

export const ColorPickerContent = withRef<
  "div",
  {
    clearColor: () => void;
    color?: string;
    colors: TColor[];
    customColors: TColor[];
    updateColor: (color: string) => void;
    updateCustomColor: (color: string) => void;
  }
>(
  (
    {
      className,
      clearColor,
      color,
      colors,
      customColors,
      updateColor,
      updateCustomColor,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();

    return (
      <div
        className={cn("flex flex-col gap-4 p-4", className)}
        ref={ref}
        {...props}
      >
        <ColorDropdownMenuItems
          color={color}
          colors={colors}
          updateColor={updateColor}
        />
        {color && (
          <DropdownMenuItem
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "cursor-pointer",
            )}
            onClick={clearColor}
          >
            {t("clear")}
          </DropdownMenuItem>
        )}
      </div>
    );
  },
);

export const ColorPicker = React.memo(
  ColorPickerContent,
  (prev, next) =>
    prev.color === next.color &&
    prev.colors === next.colors &&
    prev.customColors === next.customColors,
);
