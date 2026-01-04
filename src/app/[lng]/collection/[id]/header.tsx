"use client";

import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { useParams } from "next/navigation";

export const CollectionDetailHeader = ({ title }: { title: string }) => {
  const { lng } = useParams<{ lng: string }>();

  return (
    <MobileHeader left={<HeaderBack fallback={`/${lng}/collection`} />}>
      <div className="truncate text-center text-sm">{title}</div>
    </MobileHeader>
  );
};
