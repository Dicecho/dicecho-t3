"use client";
import { MinidenticonImg } from "@/components/MinidenticonImg";
import { Rate } from "@/components/ui/rate";
import { Star } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/react";
import { Badge } from "../ui/badge";

interface ScenarioCardProps {
  scenario: {
    coverUrl: string;
    title: string;
    author: {
      avatarUrl: string;
      nickName: string;
    };
    rateAvg: number;
    rateCount: number;
  };
  compact?: boolean;
}

export function ScenarioCard({ scenario, compact = false }: ScenarioCardProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="card group">
        <div className="relative mb-1 flex aspect-[3/4] overflow-hidden rounded-lg">
          <div
            className="absolute h-full w-full bg-cover bg-center bg-no-repeat transition-all group-hover:scale-125 group-hover:brightness-75"
            style={{
              backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)`,
            }}
          />
        </div>
        <p className="truncate text-sm text-nowrap">{scenario.title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {scenario.author.nickName}
        </p>
        {scenario.rateAvg > 0 ? (
          <div className="flex items-center gap-1 text-xs">
            <Badge className="bg-yellow-100 text-yellow-600 dark:bg-yellow-600/10 dark:text-yellow-300">
              <Star fill="currentColor" className="h-3 w-3" />
              {scenario.rateAvg}
            </Badge>
            <span className="text-muted-foreground">
              ({scenario.rateCount})
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">{t("no_review_yet")}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card group">
      <div className="relative mb-2 flex aspect-[3/4] overflow-hidden rounded-lg">
        <div
          className={clsx(
            "absolute h-full w-full bg-cover bg-center bg-no-repeat transition-all group-hover:scale-125 group-hover:brightness-75",
          )}
          style={{
            backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)`,
          }}
        />
      </div>
      <p className="truncate text-nowrap">{scenario.title}</p>

      <div className="flex items-center">
        <div className="mr-2">
          <div className="w-4 overflow-hidden rounded-lg">
            {scenario.author.avatarUrl ? (
              <Image
                className="h-4 w-4"
                width={16}
                height={16}
                src={scenario.author.avatarUrl}
                alt={scenario.author.nickName}
              />
            ) : (
              <MinidenticonImg
                username={scenario.author.nickName}
                className="h-4 w-4"
              />
            )}
          </div>
        </div>
        <span className="text-muted-foreground truncate text-sm text-nowrap">
          {scenario.author.nickName}
        </span>
      </div>

      <div className="flex w-full items-center">
        {scenario.rateAvg === 0 ? (
          <div className="text-muted-foreground text-sm">
            {t("no_review_yet")}
          </div>
        ) : (
          <>
            <Rate
              className="gap-0"
              value={scenario.rateAvg / 2}
              size="sm"
              allowHalf
              readOnly
            />

            <div className="ml-auto">
              <span className="mr-1 text-base text-yellow-500">
                {scenario.rateAvg}
              </span>
              <span className="text-muted-foreground text-sm">
                ({scenario.rateCount})
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
