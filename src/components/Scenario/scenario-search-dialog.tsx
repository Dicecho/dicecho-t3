"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScenarioWidget } from "./widget";
import { Empty } from "@/components/Empty";
import type { IModDto } from "@dicecho/types";

interface SimpleModDto {
  _id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  rateAvg?: number;
  rateCount?: number;
}

interface ScenarioSearchDialogProps {
  children: React.ReactNode;
  onSelect: (mod: SimpleModDto) => void;
  excludeIds?: string[];
}

export function ScenarioSearchDialog({
  children,
  onSelect,
  excludeIds = [],
}: ScenarioSearchDialogProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["scenario-search", debouncedKeyword],
    queryFn: async () => {
      if (!debouncedKeyword.trim()) return null;
      return api.module.list({ keyword: debouncedKeyword, pageSize: 20 });
    },
    enabled: open && debouncedKeyword.trim().length > 0,
  });

  const handleSelect = useCallback(
    (mod: IModDto) => {
      onSelect({
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        coverUrl: mod.coverUrl,
        rateAvg: mod.rateAvg,
        rateCount: mod.rateCount,
      });
      setOpen(false);
      setKeyword("");
    },
    [onSelect]
  );

  const filteredResults = data?.data.filter(
    (mod) => !excludeIds.includes(mod._id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("scenario_search")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t("scenario_search_placeholder")}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="max-h-[400px] min-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !debouncedKeyword.trim() ? (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {t("scenario_search_hint")}
              </p>
            </div>
          ) : filteredResults && filteredResults.length > 0 ? (
            <div className="space-y-2">
              {filteredResults.map((mod) => (
                <ScenarioWidget
                  key={mod._id}
                  scenario={mod}
                  variant="compact"
                  onClick={() => handleSelect(mod)}
                />
              ))}
            </div>
          ) : (
            <Empty emptyText={t("no_result")} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
