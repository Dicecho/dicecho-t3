import { LoadingAnimation } from "@/components/Loading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingAnimation />
    </div>
  );
}