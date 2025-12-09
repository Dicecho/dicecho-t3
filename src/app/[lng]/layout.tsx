import "@/styles/globals.css";
import "@/styles/components.css";

import { GeistSans } from "geist/font/sans";
import { dir } from "i18next";
import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { Layout as AppLayout } from "@/components/Layout";
import { languages } from "@/lib/i18n/settings";
import { ThemeScript } from "@/components/theme-script";

export const dynamic = 'force-static'

// TODO: support i18n
export const metadata = {
  title: "Dicecho",
  description: "TRPG一站式社区",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
  }
) {
  const params = await props.params;

  const {
    lng
  } = params;

  const {
    children
  } = props;

  return (
    <html lang={lng} dir={dir(lng)} className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-custom-gradient min-h-screen bg-no-repeat overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TRPCReactProvider>
            <AppLayout>
              <Header lng={lng} />
              {children}
              <Toaster richColors position="top-center"/>
            </AppLayout>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
