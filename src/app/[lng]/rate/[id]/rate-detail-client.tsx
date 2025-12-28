"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RateItem } from "@/components/Rate/RateItem";
import { useDicecho } from "@/hooks/useDicecho";
import type { IRateDto } from "@dicecho/types";

interface RateDetailClientProps {
  initialRate: IRateDto;
}

export function RateDetailClient({ initialRate }: RateDetailClientProps) {
  const { api, session } = useDicecho();
  const { data: rate } = useQuery({
    queryKey: ["rate", "detail", initialRate._id, session?.user?.id],
    queryFn: () => api.rate.detail(initialRate._id),
    initialData: initialRate,
    staleTime: 3600 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });

  return <RateItem rate={rate} />;
}