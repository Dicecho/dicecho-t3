import Image, { type ImageProps } from "next/image"
import type { ComponentProps, FC } from "react"
import { MinidenticonImg } from '@/components/MinidenticonImg'
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  user: {
    avatarUrl?: string | Blob
    nickName: string
  }
} & Omit<ImageProps, 'src'>

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export const UserAvatar: FC<UserAvatarProps & ComponentProps<'img'>> = ({
  user,
  className,
  ...props
}) => {
  const avatarUrl = user.avatarUrl;
  if(avatarUrl && isString(avatarUrl)) {
    // Type guard ensures avatarUrl is string here
    return (
      <Image
        // @ts-expect-error - Type guard ensures avatarUrl is string, but TypeScript can't infer it
        src={avatarUrl}
        className={className}
        {...props}
        alt={props.alt}
      />
    )
  }

  return (
    <MinidenticonImg
      username={user.nickName}
      className={cn("bg-[#f0f0f0]", className)}
      {...props}
    />
  )
}