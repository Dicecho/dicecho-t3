"use client";

import type { FC } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReplayPlayer } from "@/components/Replay/replay-player";
import { ReplayShareDialog } from "@/components/Replay/replay-share-dialog";
import { UserAvatar } from "@/components/User/Avatar";
import { LinkWithLng } from "@/components/Link";
import { ExternalLink, Info, RefreshCw, Play } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { IReplayDto } from "@/types/replay";

interface ReplayDetailClientProps {
  replay: IReplayDto;
  lng: string;
}

export const ReplayDetailClient: FC<ReplayDetailClientProps> = ({
  replay,
  lng,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const AuthorCard = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <a
            href={`https://space.bilibili.com/${replay.owner.mid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <UserAvatar
              className="h-12 w-12"
              user={{
                avatarUrl: replay.owner.face,
                nickName: replay.owner.name,
              }}
            />
          </a>
          <div className="min-w-0 flex-1">
            <a
              href={`https://space.bilibili.com/${replay.owner.mid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-medium hover:underline"
            >
              {replay.owner.name}
            </a>
            <p className="text-muted-foreground text-sm">Bilibili UP</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
          <a
            href={`https://space.bilibili.com/${replay.owner.mid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            {t("view_on_bilibili")}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  const ActionButtons = () => (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <ReplayShareDialog replay={replay}>
          <Button variant="outline" size="sm" className="w-full">
            {t("share")}
          </Button>
        </ReplayShareDialog>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={`https://www.bilibili.com/video/${replay.bvid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            {t("watch_on_bilibili")}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  const PartsListSidebar = () => {
    if (replay.pages.length <= 1) {
      return null;
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("replay_parts_list")} ({replay.pages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {replay.pages.map((page) => (
              <button
                key={page.page}
                onClick={() => setCurrentPage(page.page)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md p-2 text-left text-sm transition-colors",
                  currentPage === page.page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <span className="line-clamp-1 flex-1">
                  P{page.page}: {page.part}
                </span>
                <span
                  className={cn(
                    "ml-2 shrink-0 text-xs",
                    currentPage === page.page
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDuration(page.duration)}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const RelatedScenario = () => {
    if (!replay.mod) {
      return null;
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("related_scenario")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkWithLng href={`/scenario/${replay.mod._id}`}>
            <div className="group flex gap-3">
              <div
                className="h-20 w-14 shrink-0 rounded bg-cover bg-center"
                style={{
                  backgroundImage: `url(${replay.mod.coverUrl})`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium group-hover:underline">
                  {replay.mod.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {replay.mod.rateAvg > 0
                    ? `${replay.mod.rateAvg.toFixed(1)} (${replay.mod.rateCount})`
                    : t("no_review_yet")}
                </p>
              </div>
            </div>
          </LinkWithLng>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {/* Main Content */}
      <div className="space-y-4 md:col-span-8">
        <ReplayPlayer replay={replay} currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Video Info Card */}
        <Card className="max-md:rounded-none max-md:border-x-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg leading-tight md:text-xl">
              {replay.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mobile: Show author inline */}
            <div className="flex items-center gap-3 md:hidden">
              <UserAvatar
                className="h-10 w-10"
                user={{
                  avatarUrl: replay.owner.face,
                  nickName: replay.owner.name,
                }}
              />
              <div>
                <a
                  href={`https://space.bilibili.com/${replay.owner.mid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {replay.owner.name}
                </a>
                {replay.videos > 1 && (
                  <p className="text-muted-foreground text-sm">
                    {replay.videos} {t("replay_parts")}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile: Action buttons */}
            <div className="flex gap-2 md:hidden">
              <ReplayShareDialog replay={replay} />
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.bilibili.com/video/${replay.bvid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  {t("watch_on_bilibili")}
                </a>
              </Button>
            </div>

            <div className="bg-muted/50 flex items-start gap-2 rounded-md p-3 text-sm">
              <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-muted-foreground">
                {t("bilibili_embed_notice")}{" "}
                <a
                  href="https://www.bilibili.com/blackboard/help.html#/?qid=4d2971497eaf4cf9bec55c26c9a2983d&pid=02e75f961e554e89b61d0d5fb5b10b0a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t("learn_more")}
                </a>
              </p>
            </div>

            {replay.description && (
              <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                {replay.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mobile: Parts list */}
        {replay.pages.length > 1 && (
          <Card className="max-md:rounded-none max-md:border-x-0 md:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t("replay_parts_list")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {replay.pages.map((page) => (
                  <button
                    key={page.page}
                    onClick={() => setCurrentPage(page.page)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md p-2 text-left text-sm transition-colors",
                      currentPage === page.page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="line-clamp-1 flex-1">
                      P{page.page}: {page.part}
                    </span>
                    <span
                      className={cn(
                        "ml-2 shrink-0 text-xs",
                        currentPage === page.page
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatDuration(page.duration)}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile: Related scenario */}
        <div className="md:hidden">
          <RelatedScenario />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden space-y-4 md:col-span-4 md:block">
        <AuthorCard />
        <ActionButtons />
        <PartsListSidebar />
        <RelatedScenario />
      </div>
    </div>
  );
};
