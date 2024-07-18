"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DicechoProvider } from "@/hooks/useDicecho";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <DicechoProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </DicechoProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
