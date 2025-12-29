import { useContext, createContext, useEffect, useMemo } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { env } from "@/env";
import { createDicechoApi, type DicechoApi } from "@/utils/api";
import { jwtDecode } from "jwt-decode";

type Dicecho = {
  api: DicechoApi;
  initialized: boolean;
  session?: ReturnType<typeof useSession>["data"];
};

const DicechoContext = createContext<Dicecho | undefined>(undefined);

export const useDicecho = () => {
  const ctx = useContext(DicechoContext);
  if (!ctx)
    throw new Error(
      "No DicechoContext.Provider found when calling useDicecho.",
    );
  return ctx;
};

export const DicechoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const initialized = status !== "loading";
  const accessToken = session?.user?.accessToken;

  const api = useMemo(() => {
    return createDicechoApi({
      origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT,
      auth: {
        getAccessToken: async ({ minValidityMs = 30_000 } = {}) => {
          if (!accessToken) {
            return undefined;
          }

          try {
            const decoded = jwtDecode<{ exp?: number }>(accessToken);
            const expMs = decoded.exp ? decoded.exp * 1000 : undefined;
            if (!expMs) {
              return accessToken;
            }
            if (expMs > Date.now() + minValidityMs) {
              return accessToken;
            }
          } catch {
            return accessToken;
          }

          // 触发 NextAuth session endpoint：会跑 jwt callback，从而刷新 Dicecho token
          const refreshed = await getSession();
          return refreshed?.user?.accessToken;
        },
        onAuthInvalid: async () => {
          await signOut({ redirect: false });
        },
      },
    });
  }, [accessToken]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.authError) {
      void signOut({ redirect: false });
    }
  }, [session?.user?.authError, status]);

  return (
    <DicechoContext.Provider value={{ api, initialized, session }}>
      {children}
    </DicechoContext.Provider>
  );
};
