"use client";

import { UserBox } from "./UserBox";
import { UserAvatar } from "@/components/User/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { Button } from "@/components/ui/button";
import { NotificationBox } from "@/components/notification";
import { useTranslation } from "@/lib/i18n/react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";

export const HeaderAccount = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications({ refetchInterval: 60000 });

  return (
    <>
      {session?.user && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell size={24} />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2.5 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs flex items-center justify-center"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <NotificationBox />
          </PopoverContent>
        </Popover>
      )}
      {session?.user ? (
        <Popover>
          <PopoverTrigger>
            <UserAvatar
              user={{
                avatarUrl: session.user.avatarUrl,
              }}
              className="h-8 w-8 cursor-pointer rounded-full border"
            />
          </PopoverTrigger>
          <PopoverContent align="end">
            <UserBox
              user={{
                id: session.user._id,
                nickName: session.user.nickName,
              }}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <AuthDialog>
          <Button className="capitalize" size="sm" color="primary">
            {t("sign_in")}
          </Button>
        </AuthDialog>
      )}
    </>
  );
};
