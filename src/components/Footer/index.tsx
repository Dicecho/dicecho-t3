"use client";

import React from "react";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { House, BookText, MessagesSquare, Tv, User } from "lucide-react";
import { LinkWithLng, isUrlMatched } from "@/components/Link";
import { useTranslation } from "@/lib/i18n/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export type MobileProps = ComponentProps<"div">;

export const MobileFooter = ({ className, ...props }: MobileProps) => {
  const { data: session } = useSession();
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
    // {
    //   title: t("forum"),
    //   link: "/forum",
    //   exact: false,
    //   icon: MessagesSquare,
    // },
    // {
    //   title: t("replay"),
    //   link: "/replay",
    //   exact: false,
    //   icon: Tv,
    // },
    {
      title: t("my"),
      link: session?.user ? `/account/${session?.user?._id}` : "/account",
      exact: false,
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-between px-2 py-2 supports-backdrop-filter:bg-background/80 backdrop-blur-xs shadow-lg shadow-black/40 rounded-full ring-1 ring-black/20">
      <div
        className={clsx(
          "flex gap-4",
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
              <div className={clsx("flex flex-col items-center")}>
                <div
                  className={clsx(
                    "flex flex-col h-12 w-12 items-center justify-center transition-all rounded-full",
                    {
                      ["bg-primary text-primary-foreground shadow-primary/50 shadow-md"]:
                        matched,
                    },
                  )}
                >
                  <menu.icon size={18} />
                </div>
              </div>
            </LinkWithLng>
          );
        })}
      </div>
    </div>
  );
};
