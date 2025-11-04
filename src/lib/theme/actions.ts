'use server'

import { cookies } from 'next/headers'
import { cookieName } from './settings'

export async function setThemeCookie(theme: string) {
  const cookieStore = await cookies()

  cookieStore.set(cookieName, theme)
}
