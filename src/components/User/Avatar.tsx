import Image, { type ImageProps } from "next/image"
import type { ComponentProps, FC } from "react"
import { MinidenticonImg } from '@/components/MinidenticonImg'

type UserAvatarProps = {
  user: {
    avatarUrl?: string
    nickName: string
  }
} & Omit<ImageProps, 'src'>


export const UserAvatar: FC<UserAvatarProps & ComponentProps<'img'>> = ({
  user,
  ...props
}) => {
  if(user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        {...props}
        alt={props.alt}
      />
    )
  }

  return (
    <MinidenticonImg
      username={user.nickName}
      {...props}
    />
  )
}