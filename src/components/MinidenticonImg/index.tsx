import { cn } from "@/lib/utils";
import { minidenticon } from "minidenticons";
import { useMemo, type ComponentProps, type FC } from "react";

type MinidenticonImgProps = ComponentProps<"div"> & {
  username: string;
  saturation?: number;
  lightness?: number;
};

export const MinidenticonImg: FC<MinidenticonImgProps> = ({
  username,
  saturation = 95,
  lightness = 45,
  className,
  ...props
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness],
  );
  return (
    <div
      style={{ backgroundImage: `url(${svgURI})` }}
      className={cn("bg-muted text-muted-foreground rounded-full object-cover", className)}
      {...props}
    />
  );
};
