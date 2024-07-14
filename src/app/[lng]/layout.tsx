import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { dir } from 'i18next'
import { TRPCReactProvider } from "@/trpc/react";
import { Header } from '@/components/Header' 
import { Toaster } from "@/components/ui/toaster";
import { Layout as AppLayout } from "@/components/Layout";
import { languages } from '../../lib/i18n/settings'

// TODO: support i18n
export const metadata = {
  title: "Dicecho",
  description: "TRPG一站式社区",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng} dir={dir(lng)} className={`${GeistSans.variable}`}>
        <TRPCReactProvider>
          <AppLayout>
            <body className="bg-custom-gradient min-h-[100vh] bg-no-repeat">
              <Header lng={lng} />
              {children}
              <Toaster />
            </body>
          </AppLayout>
        </TRPCReactProvider>
    </html>
  );
}
