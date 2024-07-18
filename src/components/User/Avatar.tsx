import Image, { type ImageProps } from "next/image"
import type { ComponentProps, FC } from "react"
import { MinidenticonImg } from '@/components/MinidenticonImg'
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  user: {
    avatarUrl?: string
    nickName: string
  }
} & Omit<ImageProps, 'src'>


export const UserAvatar: FC<UserAvatarProps & ComponentProps<'img'>> = ({
  user,
  className,
  ...props
}) => {
  if(user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
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