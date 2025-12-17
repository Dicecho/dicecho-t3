'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { removeLngFromPathname } from "@/lib/i18n/utils";

export const usePurePathname = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const purePath = removeLngFromPathname(pathname);
  const search = searchParams.toString();

  return search ? `${purePath}?${search}` : purePath;
};