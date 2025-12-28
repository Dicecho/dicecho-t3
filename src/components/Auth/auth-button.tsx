"use client";

import { forwardRef } from "react";
import { useSession } from "next-auth/react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { AuthDialog } from "./AuthDialog";

export interface AuthButtonProps extends ButtonProps {
  /** Called only when user is authenticated */
  onAuthClick?: () => void;
}

/**
 * A button that requires authentication.
 * - If authenticated: executes onAuthClick normally
 * - If not authenticated: opens AuthDialog on click
 */
export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ onAuthClick, onClick, children, ...props }, ref) => {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    if (isAuthenticated) {
      return (
        <Button
          ref={ref}
          onClick={(e) => {
            onClick?.(e);
            onAuthClick?.();
          }}
          {...props}
        >
          {children}
        </Button>
      );
    }

    return (
      <AuthDialog>
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </AuthDialog>
    );
  }
);

AuthButton.displayName = "AuthButton";
