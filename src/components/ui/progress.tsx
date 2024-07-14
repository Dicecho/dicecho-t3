"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-opacity-20",
  {
    variants: {
      color: {
        primary: "bg-primary",
        destructive: "bg-destructive",
        warning: "bg-warning",
      },
      size: {
        default: "h-4",
        large: "h-6",
        sm: "h-2",
      },
    },
    defaultVariants: {
      color: 'primary',
      size: "default",
    },
  }
);

const progressIndicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    color: {
      primary: "bg-primary",
      destructive: "bg-destructive",
      warning: "bg-warning",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressIndicatorVariants> &
    VariantProps<typeof progressVariants>
>(({ className, value, color, size, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ color, size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ color }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
