import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";
import {
  BookmarkPlusIcon,
  DownloadIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { ScenarioInfo } from "./ScenarioInfo";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { IModDto } from "@dicecho/types";

type ScenarioHeaderProps = {
  lng: string;
  scenario: IModDto;
  currentTab?: "home" | "download";
};

export async function ScenarioHeader({
  lng,
  scenario,
  currentTab = "home",
}: ScenarioHeaderProps) {
  const { t } = await getTranslation(lng);

  const hasDownload = scenario.modFiles && scenario.modFiles.length > 0;

  const tabs = [
    { id: "home", label: t("home"), href: `/${lng}/scenario/${scenario._id}` },
    ...(hasDownload
      ? [
          {
            id: "download",
            label: t("download"),
            href: `/${lng}/scenario/${scenario._id}/download`,
          },
        ]
      : []),
  ];

  const actions = (
    <>
      <Button variant="outline" color="primary">
        <StarIcon size={16} />
        {t("rate")}
      </Button>
      <Button variant="outline" color="primary">
        <HeartIcon size={16} />
        {t("mark")}
      </Button>
      <Button variant="outline" color="primary" className="max-md:hidden">
        <BookmarkPlusIcon size={16} />
        {t("collect")}
      </Button>
      {scenario.canEdit && (
        <Link href={`/${lng}/scenario/${scenario._id}/edit`}>
          <Button variant="outline" color="primary">
            <PencilIcon size={16} />
            {t("scenario_edit")}
          </Button>
        </Link>
      )}
      {scenario.originUrl && (
        <Link className="ml-auto" href={scenario.originUrl} target="_blank">
          <Button color="primary">
            <LinkIcon size={16} />
            {t("origin")}
          </Button>
        </Link>
      )}
      {hasDownload && (
        <Link
          href={`/${lng}/scenario/${scenario._id}/download`}
          className="ml-auto"
        >
          <Button variant="default">
            <DownloadIcon size={16} />
            {t("download")}
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <>
      <div
        className="relative z-0 h-[280px] w-full bg-cover bg-center bg-no-repeat brightness-75 md:hidden"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <Card className="relative mt-[-16px] rounded-t-2xl rounded-b-none p-4 md:mt-10">
        <div className="md:flex md:flex-row">
          <div
            className="-mt-[40px] mr-[24px] hidden aspect-3/4 w-32 rounded-md bg-cover bg-center shadow-2xl md:block"
            style={{
              backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)`,
            }}
          />

          <div className="flex flex-1 flex-col">
            <div className="mb-2 text-2xl font-bold">{scenario.title}</div>
            {/* <div className="text-muted-foreground mb-2 text-sm">
              <span>[{t("quote_notice")}]</span>
            </div> */}

            <div className="mt-auto hidden w-full flex-wrap gap-2 md:flex">
              {actions}
            </div>
          </div>

          {/* <RateInfo
            className="bg-background/60 w-full p-4 md:hidden"
            score={scenario.rateAvg}
            count={scenario.rateCount}
            info={scenario.rateInfo}
          /> */}

          <div className="mt-2 flex flex-col gap-2 md:hidden">
            <ScenarioInfo scenario={scenario} />
            <div className="flex w-full flex-wrap gap-2">{actions}</div>
          </div>

          <div className="ml-4 hidden min-w-40 flex-col gap-2 border-l border-solid pl-4 md:flex">
            <div className="text-muted-foreground capitalize">
              {t("dicecho_rating")}
            </div>
            {scenario.rateAvg > 0 ? (
              <div>
                <span className="text-primary text-4xl font-bold">
                  {scenario.rateAvg}
                </span>
                <span className="text-muted-foreground"> / 10</span>
              </div>
            ) : (
              <div className="text-muted-foreground">
                {scenario.rateCount === 0
                  ? t("no_rating")
                  : t("too_few_ratings")}
              </div>
            )}
            {scenario.rateCount > 0 && (
              <div className="text-muted-foreground">
                <Trans
                  i18nKey="Rate.ratings"
                  t={t}
                  values={{
                    count: scenario.rateCount,
                  }}
                />
              </div>
            )}
            {scenario.markCount > 0 && (
              <div className="text-muted-foreground">
                <Trans
                  i18nKey="Rate.marks"
                  t={t}
                  values={{
                    count: scenario.markCount,
                  }}
                />
              </div>
            )}
          </div>
        </div>

      </Card>

      {/* Sticky Tabs */}
      {tabs.length > 1 && (
        <div className="sticky top-12 md:top-14 z-10 flex justify-center gap-8 md:rounded-b-2xl bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/70">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "text-muted-foreground hover:text-foreground border-b-2 border-transparent py-3 transition-colors",
                currentTab === tab.id && "text-foreground border-primary",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
