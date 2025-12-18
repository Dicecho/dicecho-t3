'use client';

import { usePathname } from "next/navigation";
import { removeLngFromPathname } from "@/lib/i18n/utils";

export const usePurePathname = () => {
  const pathname = usePathname();

  const purePath = removeLngFromPathname(pathname);

  return purePath;
};