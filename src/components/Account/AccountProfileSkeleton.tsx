import { AccountHeaderSkeleton } from "./AccountHeaderSkeleton";
import { AccountTabsSkeleton } from "./AccountTabsSkeleton";
import { AccountHomeSkeleton } from "./AccountHomeSkeleton";

export const AccountProfileSkeleton = () => {
  return (
    <>
      <AccountHeaderSkeleton />
      <AccountTabsSkeleton />
      <div className="container py-4 pb-24">
        <AccountHomeSkeleton />
      </div>
    </>
  );
};
