import { AuthDialog } from "./AuthDialog";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount } from "@/hooks/useAccount";

/**
 * Hook that provides authentication-gated action execution.
 * - If authenticated: executes callback immediately
 * - If not authenticated: opens AuthDialog, then executes callback after successful login
 * 
 * @returns {Object}
 * - requireAuth: wraps a callback to require authentication before execution
 * - AuthDialogPortal: component that renders the AuthDialog (must be included in JSX)
 */
export function useAuthAction() {
  const { isAuthenticated } = useAccount();
  const [authOpen, setAuthOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const wasAuthenticatedRef = useRef(isAuthenticated);

  // After successful login, the pending action will be executed automatically
  useEffect(() => {
    if (!wasAuthenticatedRef.current && isAuthenticated && pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const requireAuth = useCallback(
    <T extends unknown[]>(callback: (...args: T) => void) => {
      return (...args: T) => {
        if (isAuthenticated) {
          callback(...args);
        } else {
          pendingActionRef.current = () => callback(...args);
          setAuthOpen(true);
        }
      };
    },
    [isAuthenticated]
  );

  const AuthDialogPortal = useCallback(
    () => <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />,
    [authOpen]
  );

  return { requireAuth, AuthDialogPortal };
}
