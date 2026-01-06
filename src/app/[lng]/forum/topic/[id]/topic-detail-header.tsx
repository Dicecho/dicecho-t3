"use client";

import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { useParams } from "next/navigation";

interface TopicDetailHeaderProps {
  title: string;
}

export function TopicDetailHeader({ title }: TopicDetailHeaderProps) {
  const { lng } = useParams<{ lng: string }>();

  return (
    <MobileHeader
      left={<HeaderBack fallback={`/${lng}/forum`} />}
      className="fixed items-center justify-center bg-background shadow-sm"
    >
      <div className="truncate text-center text-sm font-medium">
        {title}
      </div>
    </MobileHeader>
  );
}
