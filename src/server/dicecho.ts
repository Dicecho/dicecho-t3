import { DicechoApi } from '@/utils/api'
import { env } from '@/env'

export async function getDicechoServerApi() {
  return new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT })
}