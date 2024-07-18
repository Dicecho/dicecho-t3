'use client'
import { useCookies } from "react-cookie";
import { cookieName, defaultTheme } from './settings'
import { useState } from "react";

export const useTheme = (initialTheme: string) => {
  const [cookies, setCookie] = useCookies([cookieName]);
  const [changed, setChanged] = useState(false)

  const setTheme = (theme: string) => {
    setCookie(cookieName, theme);
    setChanged(true)

    document.documentElement.setAttribute('data-theme', theme);
  }

  const theme = changed ? (cookies[cookieName] as string ?? defaultTheme) : initialTheme

  return {
    theme,
    setTheme,
  };
}