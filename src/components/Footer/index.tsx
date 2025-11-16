"use client";

import React from "react";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { House, BookText, MessagesSquare, Tv, User } from "lucide-react";
import { LinkWithLng, isUrlMatched } from "@/components/Link";
import { useTranslation } from "@/lib/i18n/react";
import { usePathname } from "next/navigation";

export type MobileProps = ComponentProps<"div">;

export const MobileFooter = ({ className, ...props }: MobileProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const menus = [
    {
      title: t("home"),
      link: "/",
      exact: true,
      icon: House,
    },
    {
      title: t("scenario"),
      link: "/scenario",
      exact: false,
      icon: BookText,
    },
    {
      title: t("forum"),
      link: "/forum",
      exact: false,
      icon: MessagesSquare,
    },
    {
      title: t("replay"),
      link: "/replay",
      exact: false,
      icon: Tv,
    },
    {
      title: t("my"),
      link: "/account",
      exact: false,
      icon: User,
    },
  ];

  return (
    <div
      className={clsx(
        "md:hidden container fixed bottom-0 flex justify-between bg-background py-4 px-4 shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.1)]",
        className,
      )}
      {...props}
    >
      {menus.map((menu) => {
        const matched = isUrlMatched({
          url: menu.link,
          path: pathname,
          exact: menu.exact,
        });

        return (
          <LinkWithLng href={menu.link} key={menu.link}>
            <div
              className={clsx("flex flex-col items-center")}
            >
              <div
                className={clsx(
                  "flex items-center justify-center w-10 h-10",
                  {['rounded-full bg-muted text-muted-foreground']: !matched },
                  {['rounded-lg bg-primary text-primary-foreground']: matched },
                )}
              >
                <menu.icon size={16} />
              </div>
            </div>
          </LinkWithLng>
        );
      })}
    </div>
  );
};
