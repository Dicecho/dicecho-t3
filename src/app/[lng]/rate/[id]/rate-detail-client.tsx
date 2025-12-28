"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RateItem } from "@/components/Rate/RateItem";
import { useDicecho } from "@/hooks/useDicecho";
import type { IRateDto } from "@dicecho/types";

interface RateDetailClientProps {
  initialRate: IRateDto;
  rateId: string;
}

export function RateDetailClient({ initialRate, rateId }: RateDetailClientProps) {
  const { data: session, status } = useSession();
  const { api } = useDicecho();
  const [rate, setRate] = useState(initialRate);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      api.rate.detail(rateId).then(setRate).catch(console.error);
    }
  }, [status, session?.user?.accessToken, api.rate, rateId]);

  return <RateItem rate={rate} />;
}