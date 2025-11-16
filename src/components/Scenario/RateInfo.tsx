'use client'

import clsx from "clsx";
import { Rate } from "@/components/ui/rate";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/react";
import { Trans } from "react-i18next";

import type { ComponentProps, FC } from "react";

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
  const { t } = useTranslation();

  return (
    <Card className={clsx(className)} {...props}>
      <div className="flex w-full gap-4">
        <div className="flex min-w-20 flex-col items-center justify-center">
          <div>
            <span className="mr-2 text-2xl text-primary">{score}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <Trans
              i18nKey="Rate.ratings"
              t={t}
              values={{
                count,
              }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {Object.keys(info)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Rate
                  className="[&>input]:h-3 [&>input]:w-3"
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
