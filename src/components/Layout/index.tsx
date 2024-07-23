"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DicechoProvider } from "@/hooks/useDicecho";
import { PhotoProvider } from "react-photo-view";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <DicechoProvider>
          <PhotoProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </PhotoProvider>
        </DicechoProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
