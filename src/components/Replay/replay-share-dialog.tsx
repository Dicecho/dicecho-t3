"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/react";
import type { IReplayDto } from "@/types/replay";

interface ReplayShareDialogProps {
  replay: IReplayDto;
  children?: React.ReactNode;
}

export const ReplayShareDialog: FC<ReplayShareDialogProps> = ({
  replay,
  children,
}) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/replay/${replay.bvid}`
      : "";
  const bilibiliUrl = `https://www.bilibili.com/video/${replay.bvid}`;

  const handleCopy = async (url: string, field: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedField(field);
    toast.success(t("share_link_copied"));
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Share2 className="mr-1.5 h-4 w-4" />
            {t("share")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("share_replay")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("share_dicecho_link")}
            </label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(shareUrl, "dicecho")}
              >
                {copiedField === "dicecho" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("share_bilibili_link")}
            </label>
            <div className="flex gap-2">
              <Input value={bilibiliUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(bilibiliUrl, "bilibili")}
              >
                {copiedField === "bilibili" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
