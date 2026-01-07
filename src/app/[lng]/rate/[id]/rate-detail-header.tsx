"use client";

import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { RateActions } from "@/components/Rate/rate-actions";
import { useParams } from "next/navigation";
import type { IRateDto } from "@dicecho/types";

interface RateDetailHeaderProps {
  rate: IRateDto;
  onDeleted?: () => void;
}

export function RateDetailHeader({ rate, onDeleted }: RateDetailHeaderProps) {
  const { lng } = useParams<{ lng: string }>();

  return (
    <MobileHeader
      left={<HeaderBack fallback={`/${lng}/scenario`} />}
      right={<RateActions rate={rate} onDeleted={onDeleted} />}
      className="fixed items-center justify-center bg-background shadow-sm"
    />
  );
}
