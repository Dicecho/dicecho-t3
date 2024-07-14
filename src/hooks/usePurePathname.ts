'use client';

import { usePathname } from "next/navigation";
import { languages } from '@/lib/i18n/settings'

const LANGUAGE_PREFIXES = languages.map(l => `/${l}`)

export const usePurePathname = () => {
  const pathname = usePathname()
  let purePath = pathname

  LANGUAGE_PREFIXES.forEach((prefix) => {
    if (purePath.startsWith(prefix)) {
      purePath = purePath.replace(prefix, '')
    }
  })

  return purePath;
}