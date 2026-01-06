"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";

interface ReplayUploadDialogProps {
  children?: React.ReactNode;
}

export const ReplayUploadDialog: FC<ReplayUploadDialogProps> = ({
  children,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { api } = useDicecho();
  const [open, setOpen] = useState(false);
  const [bvid, setBvid] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!bvid.trim()) {
      toast.error(t("please_enter_bvid"));
      return;
    }

    setIsLoading(true);
    try {
      const replay = await api.replay.detail(bvid.trim());
      setOpen(false);
      setBvid("");
      router.push(`/replay/${replay.bvid}`);
    } catch {
      toast.error(t("replay_not_found"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            {t("share_new_replay")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("share_new_replay")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bvid">{t("bilibili_bvid")}</Label>
            <Input
              id="bvid"
              placeholder={t("bilibili_bvid_placeholder")}
              value={bvid}
              onChange={(e) => setBvid(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading || !bvid.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("share")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
