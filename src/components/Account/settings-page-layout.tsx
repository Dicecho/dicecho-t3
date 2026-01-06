"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { Button } from "@/components/ui/button";
import type { PropsWithChildren } from "react";

type SettingsPageLayoutProps = PropsWithChildren<{
  title: string;
  backHref: string;
}>;

export function SettingsPageLayout({
  title,
  backHref,
  children,
}: SettingsPageLayoutProps) {
  return (
    <>
      <MobileHeader
        left={
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
        }
      >
        <h1 className="text-center text-sm font-medium truncate">{title}</h1>
      </MobileHeader>
      <div className="container py-4">{children}</div>
    </>
  );
}
