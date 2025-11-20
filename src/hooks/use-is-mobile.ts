"use client";

import { useMediaQuery } from "@uidotdev/usehooks";

export const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
}
