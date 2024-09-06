'use client'
import React from "react";
import type { IModDto } from "@dicecho/types";
import { MinidenticonImg } from '@/components/MinidenticonImg'
import { Rate } from "@/components/ui/rate";
import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/react";

interface ScenarioCardProps {
  scenario: IModDto;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const { t } = useTranslation();

  return (
    <div className="card group">
      <div className="flex aspect-[3/4] relative rounded-lg overflow-hidden mb-2">
        <div
          className={clsx(
            "absolute w-full h-full bg-cover bg-center bg-no-repeat transition-all group-hover:scale-125 group-hover:brightness-75"
          )}
          style={{ backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)` }}
        />
      </div>
      <p className="text-nowrap truncate">{scenario.title}</p>

      <div className="flex items-center">
        <div className="mr-2">
          <div className="w-4 rounded-lg overflow-hidden">
            {scenario.author.avatarUrl ? (
              <Image
                className="w-4 h-4"
                width={16}
                height={16}
                src={scenario.author.avatarUrl}
                alt={scenario.author.nickName}
              />
            ) : (
              <MinidenticonImg username={scenario.author.nickName} className="w-4 h-4" />
            )}
          </div>
        </div>
        <span className="text-nowrap truncate text-sm opacity-60">
          {scenario.author.nickName}
        </span>
      </div>

      <div className="w-full flex items-center">
        {scenario.rateAvg === 0 ? (
          <div className="text-sm opacity-60">{t('no_review_yet')}</div>
        ) : (
          <>
            <Rate value={scenario.rateAvg} size="sm" allowHalf readOnly />

            <div className="ml-auto">
              <span className="text-base text-warning mr-1">
                {scenario.rateAvg}
              </span>
              <span className="text-sm opacity-60">({scenario.rateCount})</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
