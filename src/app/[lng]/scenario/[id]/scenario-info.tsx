"use client";
import clsx from "clsx";
import dayjs from "dayjs";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { UserAvatar } from "@/components/User/Avatar";

import type { ComponentProps, FC, PropsWithChildren } from "react";
import type { IModDto } from "@dicecho/types";
import { UserAvatarPopover } from "@/components/User/UserAvatarPopover";
import { LinkWithLng } from "@/components/Link";

const InfoItem: FC<
  PropsWithChildren<ComponentProps<"div"> & { title: string }>
> = ({ title, className, children, ...props }) => {
  return (
    <div className="flex items-start gap-2" {...props}>
      <div className="text-opacity-highlight font-bold capitalize">{title}</div>
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
      {scenario.author.isForeign ? (
        <InfoItem className="flex items-center" title={t("author")}>
          <span className="mr-2 inline-block">
            <UserAvatar
              user={scenario.author}
              className="h-5 w-5 rounded-full"
            />
          </span>
          <span className="flex-1">{scenario.author.nickName}</span>
        </InfoItem>
      ) : (
        <InfoItem className="flex items-center" title={t("author")}>
          <UserAvatarPopover userId={scenario.author._id}>
            <div className="flex cursor-pointer items-center">
              <span className="mr-2 inline-block">
                <UserAvatar
                  user={scenario.author}
                  className="h-5 w-5 rounded-full"
                />
              </span>
              <span className="flex-1">{scenario.author.nickName}</span>
            </div>
          </UserAvatarPopover>
        </InfoItem>
      )}
      {scenario.isForeign && scenario.contributors.length > 0 && (
        <InfoItem title={t("contributors")}>
          <div className="flex items-center gap-2">
            {scenario.contributors.map((contributor) => (
              <UserAvatarPopover key={contributor._id} userId={contributor._id}>
                <UserAvatar
                  user={contributor}
                  className="h-5 w-5 rounded-full"
                />
              </UserAvatarPopover>
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.tags.length > 0 && (
        <InfoItem title={t("tags")}>
          <div className="flex flex-wrap items-center gap-2">
            {scenario.tags.map((tag) => (
              <LinkWithLng
                className="hover:text-primary"
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
              >
                <span>{tag}</span>
              </LinkWithLng>
            ))}
          </div>
        </InfoItem>
      )}

      {scenario.languages.length > 0 && (
        <InfoItem title={t("languages")}>
          <div className="flex items-center gap-2">
            {scenario.languages.map((language) => (
              <LinkWithLng
                className="hover:text-primary"
                key={language}
                href={`/scenario?language=${encodeURIComponent(language)}`}
              >
                {t(`language_codes.${language}`)}
              </LinkWithLng>
            ))}
          </div>
        </InfoItem>
      )}

      <InfoItem title={t("rule")}>
        <LinkWithLng
          className="hover:text-primary"
          href={`/scenario?rule=${encodeURIComponent(scenario.moduleRule)}`}
        >
          {scenario.moduleRule}
        </LinkWithLng>
      </InfoItem>

      <div className="text-muted-foreground text-sm">
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
