import clsx from "clsx";
import { ComponentProps, FC } from "react";
import { Rate } from "@/components/ui/rate";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface RateInfoProps extends ComponentProps<"div"> {
  score: number;
  count: number;
  info: Record<string, number>;
}

export const RateInfo: FC<RateInfoProps> = ({
  score,
  count,
  info,
  className,
  ref,
  ...props
}) => {
  return (
    <Card className={clsx(className)} {...props}>
      <div className="flex w-full gap-4">
        <div className="flex flex-col items-center justify-center min-w-20">
          <div>
            <span className="text-primary text-2xl mr-2">{score}</span>
            <span className="text-sm opacity-60">分</span>
          </div>
          <div className="text-sm opacity-60">{count} 个评价</div>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {Object.keys(info)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Rate
                  className="[&>input]:w-3 [&>input]:h-3"
                  value={parseInt(key)}
                  size="sm"
                />
                <Progress
                  size="sm"
                  value={(info[key]! / count) * 100}
                  color="warning"
                />
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};
