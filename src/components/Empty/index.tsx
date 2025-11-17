import Image from "next/image";
import NotAuthSvgUrl from "./notAuth.url.svg";
import { cn } from "@/lib/utils";

import type { ComponentProps, FunctionComponent, PropsWithChildren } from "react";

interface IProps extends ComponentProps<"div"> {
  emptyImageUrl?: string;
  emptyText?: string;
}

export const Empty: FunctionComponent<
  PropsWithChildren<IProps>
> = ({
  emptyImageUrl = NotAuthSvgUrl as unknown as string,
  emptyText,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full select-none flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      <Image
        src={emptyImageUrl}
        width={400}
        height={200}
        alt="empty content placeholder image"
      />
      {emptyText && <span>{emptyText}</span>}
      <div className="mt-6 flex flex-col">{props.children}</div>
    </div>
  );
};
