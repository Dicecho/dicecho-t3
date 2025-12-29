"use client";

import { forwardRef } from "react";
import { useSession } from "next-auth/react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { AuthDialog } from "./AuthDialog";

/**
 * A button that requires authentication.
 * - If authenticated: executes onClick normally
 * - If not authenticated: opens AuthDialog on click
 */
export const AuthButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, children, ...props }, ref) => {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    if (isAuthenticated) {
      return (
        <Button ref={ref} onClick={onClick} {...props}>
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
  },
);

AuthButton.displayName = "AuthButton";
