"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface ResponsiveModalContentProps {
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

interface ResponsiveModalHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveModalTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveModalTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const ResponsiveModalContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

export function ResponsiveModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ResponsiveModalContext.Provider value={{ isMobile: true }}>
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      </ResponsiveModalContext.Provider>
    );
  }

  return (
    <ResponsiveModalContext.Provider value={{ isMobile: false }}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </ResponsiveModalContext.Provider>
  );
}

export function ResponsiveModalTrigger({
  asChild,
  children,
}: ResponsiveModalTriggerProps) {
  const { isMobile } = React.useContext(ResponsiveModalContext);

  if (isMobile) {
    return <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>;
  }

  return <DialogTrigger asChild={asChild}>{children}</DialogTrigger>;
}

export function ResponsiveModalContent({
  className,
  children,
  showCloseButton,
}: ResponsiveModalContentProps) {
  const { isMobile } = React.useContext(ResponsiveModalContext);

  if (isMobile) {
    return (
      <DrawerContent className={cn("max-h-[85vh]", className)}>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted" />
        <div className="flex max-h-[calc(85vh-24px)] flex-col overflow-hidden">
          {children}
        </div>
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      className={cn("max-h-[80vh] overflow-y-auto", className)}
      showCloseButton={showCloseButton}
    >
      {children}
    </DialogContent>
  );
}

export function ResponsiveModalHeader({
  className,
  children,
}: ResponsiveModalHeaderProps) {
  const { isMobile } = React.useContext(ResponsiveModalContext);

  if (isMobile) {
    return <DrawerHeader className={className}>{children}</DrawerHeader>;
  }

  return <DialogHeader className={className}>{children}</DialogHeader>;
}

export function ResponsiveModalTitle({
  className,
  children,
}: ResponsiveModalTitleProps) {
  const { isMobile } = React.useContext(ResponsiveModalContext);

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>;
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
}
