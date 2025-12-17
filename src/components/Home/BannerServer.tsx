import { getDicechoServerApi } from "@/server/dicecho";
import { BannerCarousel } from "./BannerCarousel";
import type { BannerDto } from "@/utils/api";
import { cn } from "@/lib/utils";
import { HTMLAttributes, HTMLProps } from "react";

const DEFAULT_BANNER: BannerDto = {
  priority: 0,
  action: "",
  imageUrl: "https://file.dicecho.com/mod/600af94a44f096001d6e49df/2021033103382254.png",
  link: "",
};

interface BannerServerProps {
  className?: string;
}

export async function BannerServer({ className }: BannerServerProps) {
  const api = await getDicechoServerApi();
  const bannersData = await api.config.banner({ revalidate: 300 }).catch(() => [DEFAULT_BANNER]);
  const banners = bannersData.length > 0 ? bannersData : [DEFAULT_BANNER];

  return <BannerCarousel banners={banners} className={cn(className)} />;
}


export function BannerSkeleton({ className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <BannerCarousel banners={[DEFAULT_BANNER]} className={cn(className)} />
  );
}
