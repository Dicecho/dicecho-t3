import { AccountHeaderSkeleton } from "./AccountHeaderSkeleton";
import { AccountTabsSkeleton } from "./AccountTabsSkeleton";
import type { ReactNode } from "react";

interface AccountPageSkeletonProps {
  children?: ReactNode;
}

export const AccountPageSkeleton = ({ children }: AccountPageSkeletonProps) => {
  return (
    <>
      <AccountHeaderSkeleton />
      <AccountTabsSkeleton />
      {children}
    </>
  );
};
