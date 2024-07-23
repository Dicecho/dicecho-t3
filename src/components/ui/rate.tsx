import clsx from "clsx";
import { useId } from "react";
import type { ComponentProps, FC } from "react";

interface RateProps extends Omit<ComponentProps<"div">, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  allowHalf?: boolean;
  readOnly?: boolean;
  color?: string;
  size?: "lg" | "md" | "sm" | "xs";
  allowClear?: boolean;
}

export const Rate: FC<RateProps> = ({
  value = 0,
  onChange,
  allowHalf = false,
  readOnly = onChange === undefined,
  size = "md",
  allowClear = value === 0,
  className,
  ...props
}) => {
  const name = useId();
  const itemCount = allowHalf ? 10 : 5;
  const score = Math.floor(Math.min(Math.max(value, 0), itemCount));

  return (
    <div
      className={clsx(className, "rating", {
        "rating-half": allowHalf,
        "rating-xs": size === "xs",
        "rating-lg": size === "lg",
        "rating-sm": size === "sm",
        "rating-md": size === "md",
        "rating-read-only": readOnly,
      })}
      {...props}
    >
      {allowClear && (
        <input
          readOnly
          disabled={readOnly}
          type="radio"
          name={name}
          className="rating-hidden hidden"
          checked={score === 0}
        />
      )}
      {new Array(itemCount).fill("").map((_, index) => (
        <input
          key={index}
          disabled={readOnly}
          readOnly={readOnly}
          checked={score === index + 1}
          type="radio"
          name={name}
          className={clsx(
            "mask mask-star",
            `bg-warning`,
            { "mask-half-1": index % 2 === 0 && allowHalf },
            { "mask-half-2": index % 2 === 1 && allowHalf }
          )}
        />
      ))}
    </div>
  );
};
