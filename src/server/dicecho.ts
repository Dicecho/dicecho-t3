import { DicechoApi } from '@/utils/api'
import { getServerAuthSession } from './auth'
import { env } from '@/env'

export async function getDicechoServerApi() {
  const session = await getServerAuthSession()
  const api = new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT })
  api.setToken(session?.user ?? {})

  return api
}