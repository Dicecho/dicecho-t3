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
      link: session?.user ? `/account/${session?.user?._id}` : "/account",
      exact: false,
      icon: User,
    },
  ];

  return (
    <div className="md:hidden bg-footer fixed bottom-0 left-0 right-0 z-10 flex justify-between px-4 py-4 shadow-[0_-8px_10px_-1px_rgba(0,0,0,0.25)]">
      <div
        className={clsx(
          "container flex justify-between",
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
                    "flex h-10 w-10 items-center justify-center",
                    {
                      ["bg-input/60 text-input-foreground rounded-full"]:
                        !matched,
                    },
                    {
                      ["bg-primary text-primary-foreground rounded-lg"]:
                        matched,
                    },
                  )}
                >
                  <menu.icon size={16} />
                </div>
              </div>
            </LinkWithLng>
          );
        })}
      </div>
    </div>
  );
};
