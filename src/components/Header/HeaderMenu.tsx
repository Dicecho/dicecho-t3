import type { ComponentProps, FC } from "react";
import { Menu } from 'lucide-react';
import { HeaderMenuDrawer } from './HeaderMenuDrawer';
import { cn } from "@/lib/utils";

export const HeaderMenu: FC<ComponentProps<'svg'>> = (props) => {

  return (
    <HeaderMenuDrawer>
      {/* <Badge dot={UIStore.promptVisible && localStorage.getItem(STORAGE_KEYS.AppInstallHint) !== 'true'}> */}
      <Menu {...props} className={cn("text-muted-foreground w-5 h-5", props.className)} />
      {/* </Badge> */}
    </HeaderMenuDrawer>
  );
};

