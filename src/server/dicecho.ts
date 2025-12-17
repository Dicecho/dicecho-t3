import { createDicechoApi } from "@/utils/api";
import { env } from '@/env'
import { getServerAuthSession } from '@/server/auth'

export async function getDicechoServerApi({ withToken = false }: { withToken?: boolean } = {}) {
  if (withToken) {
    const session = await getServerAuthSession();
    return createDicechoApi({
      origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT,
      auth: {
        getAccessToken: async () => session?.user?.accessToken,
      },
    });
  }

  return createDicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT });
}
