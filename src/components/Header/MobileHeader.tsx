import { cn } from "@/lib/utils"
import type { ComponentProps, FC, PropsWithChildren, ReactNode } from "react";

type MobileHeaderProps = PropsWithChildren<
  ComponentProps<"div"> & {
    left?: ReactNode;
    right?: ReactNode;
  }
>;

export const MobileHeader: FC<MobileHeaderProps> = ({
  children,
  left,
  right,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "container sticky px-4 left-0 right-0 top-0 z-10 bg-header py-4 shadow-xl md:static md:hidden",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center gap-4">
        <div className="flex items-center justify-start">
          {left}
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-end">
          {right}
        </div>
        {children && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
