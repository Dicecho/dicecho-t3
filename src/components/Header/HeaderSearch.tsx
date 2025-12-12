import type { ComponentProps, FC } from "react";
import { SearchInput } from "../Search/SearchInput";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";

export const HeaderSearch: FC<ComponentProps<typeof SearchInput>> = (props) => {
  return (
    <Suspense
      fallback={<Skeleton className="h-8 w-[75vw] rounded-full text-sm" />}
    >
      <SearchInput
        className="w-[calc(100vw-var(--spacing)*32)]"
        {...props}
        inputClassName={cn("text-sm h-8 rounded-full", props.className)}
      />
    </Suspense>
  );
};
