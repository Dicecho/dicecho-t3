import {
  useMemo,
  type ComponentProps,
  type FC,
  PropsWithChildren,
} from "react";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  user: {
    avatarUrl?: string;
    pendantUrl?: string;
    nickName?: string;
  };
} & ComponentProps<"div">;

export const UserAvatarPendant: FC<
  PropsWithChildren<{
    pendantUrl?: string;
  }>
> = ({ pendantUrl, children }) => {
  if (!pendantUrl) {
    return children;
  }

  return (
    <span className="relative inline-block self-start leading-none">
      <span
        className="pointer-events-none absolute top-[-25%] left-[-25%] z-1 h-[150%] w-[150%] bg-cover bg-center"
        style={{ backgroundImage: `url(${pendantUrl})` }}
      />
      {children}
    </span>
  );
};

export const UserAvatar: FC<UserAvatarProps> = ({
  user,
  className,
  ...props
}) => {
  const { avatarUrl, pendantUrl, nickName } = user;

  const avatar = useMemo(() => {
    if (avatarUrl) {
      return avatarUrl;
    }

    const generateAvatar = createAvatar(thumbs, {
      seed: nickName ?? "",
    });

    return (
      "data:image/svg+xml;utf8," + encodeURIComponent(generateAvatar.toString())
    );
  }, [avatarUrl, nickName]);

  return (
    <UserAvatarPendant pendantUrl={pendantUrl}>
      <div
        style={{ backgroundImage: `url("${avatar}")` }}
        className={cn(
          "rounded-full bg-cover bg-center object-cover",
          { "bg-muted text-muted-foreground": !avatar },
          className,
        )}
        {...props}
      />
    </UserAvatarPendant>
  );
};
