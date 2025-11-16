"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      color: {
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        yellow: "bg-yellow-500/20",
      },
      size: {
        default: "h-4",
        large: "h-6",
        sm: "h-2",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "default",
    },
  },
);

const progressIndicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      yellow: "bg-yellow-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  color?: "primary" | "secondary" | "yellow";
  size?: "default" | "large" | "sm";
}

function Progress({ className, color, size, value, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ color, size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressIndicatorVariants({ color }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
