"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuthAction } from "./use-auth-action";

interface AuthButtonProps extends ButtonProps {
  asChild?: boolean;
}

/**
 * A button that requires authentication.
 * - If authenticated: executes onClick normally
 * - If not authenticated: opens AuthDialog, then executes onClick after successful login
 */
export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ onClick, children, asChild = false, ...props }, ref) => {
    const { requireAuth, AuthDialogPortal } = useAuthAction();

    const wrappedOnClick = onClick ? requireAuth(onClick) : undefined;

    if (asChild) {
      return (
        <>
          <Slot ref={ref} onClick={wrappedOnClick} {...props}>
            {children}
          </Slot>
          <AuthDialogPortal />
        </>
      );
    }

    return (
      <>
        <Button ref={ref} onClick={wrappedOnClick} {...props}>
          {children}
        </Button>
        <AuthDialogPortal />
      </>
    );
  },
);

AuthButton.displayName = "AuthButton";
