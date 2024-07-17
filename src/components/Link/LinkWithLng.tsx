import Link, { type LinkProps } from "next/link";
import type { FC, PropsWithChildren } from "react";
import { useTranslation } from "@/lib/i18n/react";
import { removeLngFromPathname } from "@/lib/i18n/utils";

export const LinkWithLng: FC<PropsWithChildren<LinkProps>> = ({ href, ...props }) => {
  const { i18n } = useTranslation();

  const to = (() => {
    if (typeof href === "string") return  `/${i18n.language}${removeLngFromPathname(href)}`;

    return {
      ...href,
      pathname: href.pathname ? `/${i18n.language}${removeLngFromPathname(href.pathname)}` : undefined,
    }
  })()

  return <Link href={to} {...props} />;
};
