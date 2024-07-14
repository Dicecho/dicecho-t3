"use client";
import { useState, useContext, createContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { env } from "@/env";
import { DicechoApi } from "@/utils/api";

type Dicecho = {
  api: DicechoApi;
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
  const { data: session } = useSession();
  const [api] = useState(
    new DicechoApi({ origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT }),
  );

  useEffect(() => {
    api.setToken(session?.user ?? {})
  }, [session?.user, api])

  return (
    <DicechoContext.Provider value={{ api }}>
      {children}
    </DicechoContext.Provider>
  );
};
