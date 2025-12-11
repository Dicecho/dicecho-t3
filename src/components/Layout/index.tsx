"use client";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "@/trpc/react";
import { DicechoProvider } from "@/hooks/useDicecho";
import { PhotoProvider } from "react-photo-view";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <TRPCReactProvider>
      <SessionProvider>
        <DicechoProvider>
          <PhotoProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </PhotoProvider>
        </DicechoProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
};
