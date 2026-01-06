"use client";

import { SettingsMenu } from "./settings-menu";
import { SettingsSidebar } from "./settings-sidebar";
import { ProfileForm } from "./profile-form";
import type { IUserDto } from "@dicecho/types";
import type { ReactNode } from "react";

type SettingsPageContentProps = {
  user: IUserDto;
  userId: string;
  lng: string;
  children?: ReactNode;
};

export function SettingsPageContent({ user, userId, lng, children }: SettingsPageContentProps) {
  return (
    <>
      {/* Mobile: Show menu */}
      <div className="md:hidden">
        <SettingsMenu userId={userId} lng={lng} />
      </div>

      {/* Desktop: Sidebar + Content */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-6">
        <SettingsSidebar userId={userId} lng={lng} />
        <div>
          {children ?? <ProfileForm user={user} />}
        </div>
      </div>
    </>
  );
}
