"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setUserId } from "@/lib/analytics";

/**
 * Sets the GA user_id when a user is authenticated
 * This allows tracking user behavior across sessions
 */
export function UserTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?._id) {
      setUserId(session.user._id);
    } else {
      setUserId(undefined);
    }
  }, [session, status]);

  return null;
}
