"use client";

import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuthAction } from "./use-auth-action";

/**
 * A button that requires authentication.
 * - If authenticated: executes onClick normally
 * - If not authenticated: opens AuthDialog, then executes onClick after successful login
 */
export const AuthButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, children, ...props }, ref) => {
    const { requireAuth, AuthDialogPortal } = useAuthAction();

    return (
      <>
        <Button
          ref={ref}
          onClick={onClick ? requireAuth(onClick) : undefined}
          {...props}
        >
          {children}
        </Button>
        <AuthDialogPortal />
      </>
    );
  },
);

AuthButton.displayName = "AuthButton";
