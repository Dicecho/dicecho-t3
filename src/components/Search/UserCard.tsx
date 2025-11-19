"use client";

import { IUserDto } from "@dicecho/types";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/User/Avatar";
import { useTranslation } from "@/lib/i18n/react";
import Link from "next/link";

interface UserCardProps {
  user: IUserDto;
  lng: string;
  className?: string;
}

export function UserCard({ user, lng, className }: UserCardProps) {
  const { t } = useTranslation();
  
  return (
    <Link href={`/${lng}/account/${user._id}`}>
      <Card className={`cursor-pointer transition-shadow hover:shadow-md ${className || ""}`}>
        <div className="flex items-center gap-4 p-4">
          <UserAvatar
            user={user}
            alt={user.nickName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{user.nickName}</h3>
            {user.avatarUrl && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {user.note || t("profile_notice_empty")}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

