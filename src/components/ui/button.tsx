import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        default: 
          "",
        primary:
          "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-secondary/90",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/80 hover:border-accent/90",
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:border-muted/90",
        success:
          "bg-success text-success-foreground border-success hover:bg-success/90 hover:border-success/90",
        info: "bg-info text-info-foreground border-info hover:bg-info/90 hover:border-info/90",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 hover:border-destructive/90",
        warning:
          "bg-warning text-warning-foreground border-warning hover:bg-warning/90 hover:border-warning/90",
      },
      variant: {
        default: "",
        outline: "border bg-transparent hover:bg-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        color: "info",
        class: "text-info hover:text-info/80",
      },
      {
        variant: "outline",
        color: "success",
        class: "text-success hover:text-success/80",
      },
      {
        variant: "outline",
        color: "destructive",
        class: "text-destructive hover:text-destructive/80",
      },
      {
        variant: "outline",
        color: "warning",
        class: "text-warning hover:text-warning/80",
      },
      {
        variant: "outline",
        color: "primary",
        class: "text-primary hover:text-primary/80",
      },
      {
        variant: "outline",
        color: "secondary",
        class: "text-secondary hover:text-secondary/80",
      },
      {
        variant: "outline",
        color: "accent",
        class: "text-accent hover:text-accent/80",
      },
      {
        variant: "outline",
        color: "muted",
        class: "text-muted hover:text-muted/80",
      },
    ],
    defaultVariants: {
      color: "default",
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, color, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
