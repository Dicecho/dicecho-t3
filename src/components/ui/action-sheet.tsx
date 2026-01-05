"use client";

import * as React from "react";
import { forwardRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const ActionSheet = Drawer;
const ActionSheetTrigger = DrawerTrigger;
const ActionSheetClose = DrawerClose;

const ActionSheetContent = forwardRef<
  React.ComponentRef<typeof DrawerContent>,
  React.ComponentPropsWithoutRef<typeof DrawerContent>
>(({ className, children, ...props }, ref) => (
  <DrawerContent
    ref={ref}
    className={cn("bg-transparent border-none shadow-none", className)}
    {...props}
  >
    <DrawerHeader>
      <DrawerTitle className="hidden">Actions</DrawerTitle>
    </DrawerHeader>
    <div className="px-4 pb-4">{children}</div>
  </DrawerContent>
));
ActionSheetContent.displayName = "ActionSheetContent";

const ActionSheetGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "cancel" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[14px] overflow-hidden",
      variant === "default" &&
        "bg-background/80 dark:bg-muted/80 backdrop-blur-xl",
      variant === "cancel" && "mt-2 bg-background dark:bg-muted",
      className,
    )}
    {...props}
  />
));
ActionSheetGroup.displayName = "ActionSheetGroup";

interface ActionSheetItemProps extends React.HTMLAttributes<HTMLElement> {
  danger?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}

const ActionSheetItem = forwardRef<HTMLElement, ActionSheetItemProps>(
  ({ children, danger, className, asChild, disabled, ...props }, ref) => {
    const Comp = asChild ? "div" : "button";
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
        disabled={!asChild ? disabled : undefined}
        className={cn(
          "flex h-14 w-full items-center justify-center text-base font-normal",
          "border-t border-border/30 first:border-t-0",
          "text-primary active:bg-muted/50 disabled:opacity-50",
          danger && "text-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
ActionSheetItem.displayName = "ActionSheetItem";

export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetGroup,
  ActionSheetItem,
  ActionSheetClose,
};
