import type { ComponentProps, FC } from "react";
import { SearchInput } from "../Search/SearchInput";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";

export const HeaderSearch: FC<ComponentProps<typeof SearchInput>> = (props) => {
  return (
    <Suspense fallback={<Skeleton className="w-[75vw] text-sm h-8 rounded-full" />}>
      <SearchInput
        {...props}
        inputClassName={cn(
          "w-[75vw] text-sm h-8 rounded-full",
          props.className,
        )}
      />
    </Suspense>
  );
};
