"use client";

import type { FC, ComponentProps } from "react";
import type { IReplayDto } from "@/types/replay";
import { cn, formatDuration } from "@/lib/utils";
import { UserAvatar } from "@/components/User/Avatar";

interface ReplayItemProps extends ComponentProps<"div"> {
  replay: IReplayDto;
}

export const ReplayItem: FC<ReplayItemProps> = ({
  replay,
  className,
  ...props
}) => {
  return (
    <div className={cn("group cursor-pointer overflow-hidden", className)} {...props}>
      <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
        <div
          className="absolute h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: `url(${replay.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {formatDuration(replay.duration)}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-tight">{replay.title}</p>

      <div className="mt-1.5 flex items-center gap-2">
        <UserAvatar
          className="h-5 w-5"
          user={{ avatarUrl: replay.owner.face, nickName: replay.owner.name }}
        />
        <span className="text-muted-foreground truncate text-xs">
          {replay.owner.name}
        </span>
      </div>
    </div>
  );
};
