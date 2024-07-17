"use client";
import type { ComponentProps, FC } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/react";

export const HeaderBack: FC<ComponentProps<"button">> = ({
  className = "",
  ...props
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <button
      className={clsx("flex", className)}
      {...props}
      onClick={() => router.back()}
    >
      <ChevronLeft />
      {t("back")}
    </button>
  );
};
