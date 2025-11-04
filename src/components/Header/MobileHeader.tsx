import { cn } from "@/lib/utils"
import type { ComponentProps, FC, PropsWithChildren } from "react";

type MobileHeaderProps = PropsWithChildren<ComponentProps<"div">>;

export const MobileHeader: FC<MobileHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "container sticky left-0 right-0 top-0 z-10 flex gap-4 bg-base-200 py-4 shadow-xl md:static md:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
