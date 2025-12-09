"use client";
import type { ComponentProps, FC } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/react";

export const HeaderBack: FC<
  ComponentProps<"button"> & { fallback?: string }
> = ({ className = "", fallback, ...props }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <button
      className={clsx("flex text-sm", className)}
      {...props}
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.replace(fallback ?? `/${lng}`);
        }
      }}
    >
      <ChevronLeft className="w-5 h-5" />
      {t("back")}
    </button>
  );
};
