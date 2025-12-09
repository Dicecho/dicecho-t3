import type { ComponentProps, FC } from "react";
import { SearchInput } from "../Search/SearchInput";
import { cn } from "@/lib/utils";

export const HeaderSearch: FC<ComponentProps<typeof SearchInput>> = (props) => {
  return (
    <SearchInput {...props} inputClassName={cn("w-[75vw] text-sm h-8 rounded-full", props.className)} />
  );
};

