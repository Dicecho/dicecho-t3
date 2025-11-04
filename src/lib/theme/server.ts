import { cookies } from 'next/headers';
import { cookieName, defaultTheme } from './settings'

export const getTheme = async () => {
  const cookie = await cookies();
  const theme = cookie.get(cookieName)
  return theme?.value ?? defaultTheme
}