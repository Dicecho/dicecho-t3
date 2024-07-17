import { minidenticon } from "minidenticons";
import { useMemo, type ComponentProps, type FC } from "react";

type MinidenticonImgProps = ComponentProps<"img"> & {
  username: string;
  saturation?: number;
  lightness?: number;
};

export const MinidenticonImg: FC<MinidenticonImgProps> = ({
  username,
  saturation = 95,
  lightness = 45,
  ...props
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness],
  );
  return <img src={svgURI} alt={username} {...props} />;
};