import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { env } from "@/env";


if (env.PROXY_AGENT_URL) {
  setGlobalDispatcher(new ProxyAgent(env.PROXY_AGENT_URL));
}

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const api = createCaller(createContext);
