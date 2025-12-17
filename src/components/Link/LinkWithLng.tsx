import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { useTranslation } from "@/lib/i18n/react";
import { removeLngFromPathname } from "@/lib/i18n/utils";

type LinkWithLngProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export const LinkWithLng = ({ href, ...props }: LinkWithLngProps) => {
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
