"use client";
import clsx from "clsx";
import dayjs from "dayjs";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { LanguageCodeMap } from "@/utils/language";
import { UserAvatar } from "@/components/User/Avatar";

import type { LanguageCodes } from "@/utils/language";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import type { IModDto } from "@dicecho/types";

const InfoItem: FC<
  PropsWithChildren<ComponentProps<"div"> & { title: string }>
> = ({ title, className, children, ...props }) => {
  return (
    <div className="flex items-start gap-2" {...props}>
      <div className="font-bold capitalize text-opacity-highlight">{title}</div>
      <div className={clsx("flex-1", className)}>{children}</div>
    </div>
  );
};

interface ScenarioInfoProps extends ComponentProps<"div"> {
  scenario: IModDto;
}

export const ScenarioInfo: FC<ScenarioInfoProps> = ({
  scenario,
  className,
  ref,
  ...props
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <InfoItem className="flex items-center" title={t("author")}>
        <span className="mr-2 inline-block">
          <UserAvatar
            user={scenario.author}
            className="h-5 w-5 rounded-full"
          />
        </span>
        <span className="flex-1">{scenario.author.nickName}</span>
      </InfoItem>

      {scenario.isForeign && scenario.contributors.length > 0 && (
        <InfoItem title={t("contributors")}>
          <div className="flex items-center gap-2">
            {scenario.contributors.map((contributor) => (
              <UserAvatar
                user={contributor}
                key={contributor._id}
                className="h-5 w-5 rounded-full"
              />
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.tags.length > 0 && (
        <InfoItem title={t("tags")}>
          <div className="flex items-center gap-2 flex-wrap">
            {scenario.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.languages.length > 0 && (
        <InfoItem title={t("languages")}>
          <div className="flex items-center gap-2">
            {scenario.languages.map((language) => (
              <span key={language}>
                {LanguageCodeMap[i18n.language]![language as LanguageCodes]}
              </span>
            ))}
          </div>
        </InfoItem>
      )}

      <InfoItem title={t("rule")}>
        {scenario.moduleRule}
      </InfoItem>

      <div className="text-sm text-muted-foreground">
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
};
