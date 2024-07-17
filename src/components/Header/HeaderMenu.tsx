import type { ComponentProps, FC } from "react";
import { Menu } from 'lucide-react';
import { HeaderMenuDrawer } from './HeaderMenuDrawer';

export const HeaderMenu: FC<ComponentProps<'svg'>> = (props) => {

  return (
    <HeaderMenuDrawer>
      {/* <Badge dot={UIStore.promptVisible && localStorage.getItem(STORAGE_KEYS.AppInstallHint) !== 'true'}> */}
      <Menu {...props} />
      {/* </Badge> */}
    </HeaderMenuDrawer>
  );
};

