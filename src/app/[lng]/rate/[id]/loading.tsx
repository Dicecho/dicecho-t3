import { RateDetailSkeleton } from "./rate-detail-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-6 gap-8 md:container">
      <div className="col-span-6 md:col-span-4">
        <RateDetailSkeleton />
      </div>
    </div>
  );
}
