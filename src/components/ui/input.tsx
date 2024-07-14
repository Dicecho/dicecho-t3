'use client';

import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        default: 
          "",
        success:
          "border-success",
        info: "border-info",
        destructive:
          "border-destructive",
        warning:
          "border-warning",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'>,
  VariantProps<typeof inputVariants> {
    onEnter?: () => void
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, color, onEnter = () => {}, ...props }, ref) => {
    const _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onEnter()
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-box bg-base-200 px-3 py-2 text-sm ring-offset-background placeholder:opacity-60",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          inputVariants({ color }),
          className
        )}
        ref={ref}
        onKeyDown={_handleKeyDown}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
