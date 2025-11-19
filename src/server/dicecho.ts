import { DicechoApi } from '@/utils/api'
import { env } from '@/env'
import { getServerAuthSession } from '@/server/auth'

export async function getDicechoServerApi({ withToken = false }: { withToken?: boolean } = {}) {
  const api = new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT });
  if (withToken) {
    const session = await getServerAuthSession();
    api.setToken(session?.user ?? {});
  }

  return api;
}