import { DicechoApi } from '@/utils/api'
import { getServerAuthSession } from './auth'
import { env } from '@/env'

export async function getDicechoServerApi() {
  const session = await getServerAuthSession()
  const api = new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT })

  if (session?.user.exp && session?.user.exp * 1000 > Date.now()) {
    api.setToken(session?.user ?? {})
  }

  return api
}