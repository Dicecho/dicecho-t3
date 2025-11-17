import { Star } from "lucide-react";
import type { ComponentProps, FC } from "react";

import { cn } from "@/lib/utils"

type RateColor = "accent" | "primary" | "yellow" | "destructive";

const STAR_COLOR_MAP: Record<RateColor, string> = {
  accent: "text-accent",
  primary: "text-primary",
  yellow: "text-yellow-500",
  destructive: "text-destructive",
};

interface RateProps extends Omit<ComponentProps<"div">, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  allowHalf?: boolean;
  readOnly?: boolean;
  color?: RateColor;
  size?: "lg" | "md" | "sm" | "xs";
  allowClear?: boolean;
}

const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const Rate: FC<RateProps> = ({
  value = 0,
  onChange,
  allowHalf = false,
  readOnly = onChange === undefined,
  size = "md",
  allowClear = true,
  color = "yellow",
  className,
  ...props
}) => {
  const starCount = 5;
  const iconSize = SIZE_MAP[size];

  const handleClick = (index: number, isHalf: boolean) => {
    if (readOnly || !onChange) return;
    const newValue = index + (isHalf && allowHalf ? 0.5 : 1);

    // Allow clearing by clicking the same value
    if (allowClear && newValue === value) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFullyFilled = value >= starValue;
    const isHalfFilled = allowHalf && value >= starValue - 0.5 && value < starValue;

    return (
      <div
        key={index}
        className={cn("relative inline-flex", {
          "cursor-pointer": !readOnly,
          "cursor-default": readOnly,
        })}
      >
        {/* Background star (empty) */}
        <Star
          size={iconSize}
          strokeWidth={0}
          className="fill-muted"
          onClick={() => !readOnly && handleClick(index, false)}
        />

        {/* Filled overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: isFullyFilled ? "100%" : isHalfFilled ? "50%" : "0%",
          }}
        >
          <Star
            size={iconSize}
            strokeWidth={0}
            className={cn("fill-current transition-colors", STAR_COLOR_MAP[color])}
            onClick={() => !readOnly && handleClick(index, true)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("inline-flex gap-1", className)} {...props}>
      {Array.from({ length: starCount }, (_, i) => renderStar(i))}
    </div>
  );
};
