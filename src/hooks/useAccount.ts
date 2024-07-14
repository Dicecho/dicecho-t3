'use client'
import { useSession } from "next-auth/react";
import type { IUserDto } from '@dicecho/types'

type UseAccount = {
  isAuthenticated: true;
  account: IUserDto;
} | {
  isAuthenticated: false;
  account: undefined;
}

export const useAccount = (): UseAccount => {
  const { data: session } = useSession();

  if (!session) {
    return {
      isAuthenticated: false,
      account: undefined,
    }
  }

  return {
    isAuthenticated: true,
    account: session.user
  }
}