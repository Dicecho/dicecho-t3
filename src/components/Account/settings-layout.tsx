"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { Button } from "@/components/ui/button";
import { SettingsSidebar } from "./settings-sidebar";

type SettingsLayoutProps = PropsWithChildren<{
  user: { _id: string };
  lng: string;
  title: string;
  backHref: string;
}>;

export function SettingsLayout({
  user,
  lng,
  title,
  backHref,
  children,
}: SettingsLayoutProps) {
  return (
    <>
      {/* Mobile Header */}
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

      {/* Content */}
      <div className="container py-4">
        {/* Desktop: Sidebar + Content */}
        <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-6">
          <SettingsSidebar userId={user._id} lng={lng} />
          <div>{children}</div>
        </div>

        {/* Mobile: Content only */}
        <div className="md:hidden">{children}</div>
      </div>
    </>
  );
}
