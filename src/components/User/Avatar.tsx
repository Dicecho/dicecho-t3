import type { ComponentProps, FC } from "react";
import { MinidenticonImg } from "@/components/MinidenticonImg";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  user: {
    avatarUrl?: string;
    pendantUrl?: string;
    nickName?: string;
  }
} & ComponentProps<"div">;

export const UserAvatar: FC<UserAvatarProps> = ({
  user,
  className,
  ...props
}) => {
  const { avatarUrl, pendantUrl, nickName } = user;

  const avatarElement = !avatarUrl ? (
    <MinidenticonImg
      username={nickName ?? ""}
      className={cn("bg-muted text-muted-foreground bg-cover bg-center", className)}
      {...props}
    />
  ) : (
    <div
      style={{ backgroundImage: `url(${avatarUrl})` }}
      className={cn(
        "rounded-full object-cover bg-cover bg-center",
        { "bg-muted text-muted-foreground": !avatarUrl },
        className,
      )}
      {...props}
    />
  );

  // 如果有装饰框,自动包裹 Pendant
  if (pendantUrl) {
    return (
      <span className={cn("relative inline-block leading-none")}>
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-1 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${pendantUrl})` }}
        />
        {avatarElement}
      </span>
    );
  }

  return avatarElement;
};
