import { useState, useContext, createContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { env } from "@/env";
import { DicechoApi } from "@/utils/api";

type Dicecho = {
  api: DicechoApi;
  initialized: boolean;
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
  const [initialized, setInitialized] = useState(false);
  const [api] = useState(
    new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT }),
  );

  useEffect(() => {
    if (status === 'loading') {
      setInitialized(false);
      return;
    }
    
    api.setToken(session?.user ?? {});
    setInitialized(true);
  }, [session?.user, api, status])

  return (
    <DicechoContext.Provider value={{ api, initialized }}>
      {children}
    </DicechoContext.Provider>
  );
};
