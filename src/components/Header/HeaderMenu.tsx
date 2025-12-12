"use client";

import type { ComponentProps, FC } from "react";
import { Menu } from 'lucide-react';
import { HeaderMenuDrawer } from './HeaderMenuDrawer';
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { UserAvatar } from "../User/Avatar";

export const HeaderMenu: FC<ComponentProps<'svg'>> = (props) => {
  const { data: session } = useSession();

  return (
    <HeaderMenuDrawer>
      {session?.user ? (
        <UserAvatar
          user={{
            avatarUrl: session.user.avatarUrl,
          }}
          className="h-8 w-8 cursor-pointer rounded-full"
        />
      ) : <Menu {...props} className={cn("text-muted-foreground w-5 h-5", props.className)} />}
    </HeaderMenuDrawer>
  );
};

