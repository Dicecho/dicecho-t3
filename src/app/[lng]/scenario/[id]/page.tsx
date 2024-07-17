import type { IModListQuery } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { getDicechoServerApi } from "@/server/dicecho";
import { UserAvatar } from "@/components/User/Avatar";
import dayjs from "dayjs";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { Card } from "@/components/ui/card";
import { Album } from "@/components/Album";
import { Trans } from "react-i18next/TransWithoutContext";
import { StarIcon, HeartIcon, BookmarkPlusIcon, LinkIcon } from "lucide-react";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { LanguageCodes, LanguageCodeMap } from "@/utils/language";
import Link from "next/link";
import { ScenarioDetailHeader } from './header'
import { HeaderBack } from "@/components/Header/HeaderBack";

const InfoItem: FC<
  PropsWithChildren<ComponentProps<"div"> & { title: string }>
> = ({ title, className, children, ...props }) => {
  return (
    <div className="flex items-center gap-2 " {...props}>
      <div className="font-bold capitalize">{title}</div>
      <div className={clsx("flex-1", className)}>{children}</div>
    </div>
  );
};

const ScenarioDetailPage = async ({
  params: { lng, id },
}: {
  params: { lng: string; id: string };
}) => {
  const { t } = await useTranslation(lng);
  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id);

  const infos = (
    <>
      <InfoItem className="flex items-center" title={t("author")}>
        <span className="mr-2 inline-block">
          <UserAvatar
            user={scenario.author}
            alt={scenario.author.nickName}
            className="h-5 w-5 rounded-full"
            width={20}
            height={20}
          />
        </span>
        <span className="flex-1 opacity-60">{scenario.author.nickName}</span>
      </InfoItem>

      {scenario.isForeign && scenario.contributors.length > 0 && (
        <InfoItem title={t("contributors")}>
          <div className="flex items-center gap-2">
            {scenario.contributors.map((contributor) => (
              <UserAvatar
                user={contributor}
                key={contributor._id}
                alt={contributor.nickName}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover"
              />
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.tags.length > 0 && (
        <InfoItem title={t("tags")} className="opacity-60">
          <div className="flex items-center gap-2">
            {scenario.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.languages.length > 0 && (
        <InfoItem title={t("languages")} className="opacity-60">
          <div className="flex items-center gap-2">
            {scenario.languages.map((language) => (
              <span key={language}>
                {LanguageCodeMap[lng]![language as LanguageCodes]}
              </span>
            ))}
          </div>
        </InfoItem>
      )}

      <InfoItem title={t("rule")} className="opacity-60">
        {scenario.moduleRule}
      </InfoItem>

      <div className="text-sm opacity-60">
        <Trans
          i18nKey="publish_at"
          t={t}
          shouldUnescape
          values={{
            date: dayjs(scenario.releaseDate).format("YYYY/MM/DD"),
          }}
        />
      </div>
    </>
  );

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
      <Button variant="outline" color="primary">
        <BookmarkPlusIcon size={16} />
        {t("collect")}
      </Button>
      <Link className="ml-auto" href={scenario.originUrl} target="_blank">
        <Button color="primary">
          <LinkIcon size={16} />
          {t("origin")}
        </Button>
      </Link>
    </>
  );

  return (
    <>
      <ScenarioDetailHeader title={scenario.title} />
      <div className="md:container">
        <div
          className="relative z-0 h-[280px] w-full bg-cover bg-center bg-no-repeat brightness-75 md:hidden"
          style={{ backgroundImage: `url(${scenario.coverUrl})` }}
        />
        <Card className="relative mt-[-16px] rounded-t-2xl p-4 md:mt-10 md:flex md:rounded">
          <div
            className="-mt-[40px] mr-[24px] hidden aspect-[3/4] w-32 bg-cover bg-center shadow-2xl md:block"
            style={{ backgroundImage: `url(${scenario.coverUrl})` }}
          />

          <div className="flex flex-1 flex-col">
            <div className="mb-2 text-2xl font-bold">{scenario.title}</div>
            <div className="mb-2 text-sm">
              <span className="opacity-60">[{t("quote_notice")}]</span>
            </div>

            <div className="mt-auto hidden w-full gap-2 md:flex">{actions}</div>
          </div>

          <RateInfo
            className="w-full bg-accent p-4 md:hidden"
            score={scenario.rateAvg}
            count={scenario.rateCount}
            info={scenario.rateInfo}
          />

          <div className="mt-2 flex flex-col gap-2 md:hidden">{infos}</div>

          <div className="ml-4 hidden min-w-40 flex-col gap-2 border-l-[1px] border-solid pl-4 md:flex">
            <div className="capitalize opacity-45">{t("dicecho_rating")}</div>
            {scenario.rateAvg > 0 ? (
              <div>
                <span className="text-4xl font-bold text-primary">
                  {scenario.rateAvg}
                </span>
                <span className="opacity-45"> / 10</span>
              </div>
            ) : (
              <div className="opacity-60">
                {scenario.rateCount === 0
                  ? t("no_rating")
                  : t("too_few_ratings")}
              </div>
            )}
            {scenario.rateCount > 0 && (
              <div className="opacity-60">
                <Trans
                  i18nKey="ratings"
                  t={t}
                  values={{
                    count: scenario.rateCount,
                  }}
                />
              </div>
            )}
            {scenario.markCount > 0 && (
              <div className="opacity-60">
                <Trans
                  i18nKey="marks"
                  t={t}
                  values={{
                    count: scenario.markCount,
                  }}
                />
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 md:col-span-4">
            {scenario.imageUrls.length > 0 && (
              <Card className="relative mt-4 w-full p-4">
                <Album imageUrls={scenario.imageUrls} />
              </Card>
            )}

            {scenario.description && (
              <Card className="relative mt-4 w-full p-4">
                <article className="line-clamp-4 whitespace-pre-line break-words opacity-65">
                  {scenario.description}
                </article>
              </Card>
            )}
          </div>
          <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
            <Card className="relative mt-4 flex w-full flex-col gap-4 p-4">
              {infos}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScenarioDetailPage;
