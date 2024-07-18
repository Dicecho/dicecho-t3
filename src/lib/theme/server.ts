import { cookies } from 'next/headers'
import { cookieName, defaultTheme } from './settings'

export const getTheme = () => {
  const theme = cookies().get(cookieName)
  return theme?.value ?? defaultTheme
}