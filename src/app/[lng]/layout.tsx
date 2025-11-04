import "@/styles/globals.css";
import "@/styles/components.css";

import { GeistSans } from "geist/font/sans";
import { dir } from "i18next";
import { TRPCReactProvider } from "@/trpc/react";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Layout as AppLayout } from "@/components/Layout";
import { languages } from "@/lib/i18n/settings";
import { getTheme } from "@/lib/theme/server";
import { DARK_THEMES, THEMES } from "@/lib/theme/constants";

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

  const theme = await getTheme();
  const isDarkTheme = DARK_THEMES.some((t) => t === theme);
  return (
    <html lang={lng} dir={dir(lng)} data-theme={theme} className={`${GeistSans.variable} ${isDarkTheme ? "dark" : "light"}`}>
      <TRPCReactProvider>
        <AppLayout>
          <body className="bg-custom-gradient min-h-screen bg-no-repeat">
            <Header lng={lng} theme={theme} />
            {children}
            <Toaster />
          </body>
        </AppLayout>
      </TRPCReactProvider>
    </html>
  );
}
