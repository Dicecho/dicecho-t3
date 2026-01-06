"use client";

import { FC, useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IReplayDto } from "@/types/replay";

interface ReplayPlayerProps {
  replay: IReplayDto;
  className?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const ReplayPlayer: FC<ReplayPlayerProps> = ({
  replay,
  className,
  currentPage: externalPage,
  onPageChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalPage, setInternalPage] = useState(1);

  const currentPage = externalPage ?? internalPage;
  const setCurrentPage = (page: number | ((prev: number) => number)) => {
    const newPage = typeof page === "function" ? page(currentPage) : page;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const iframeSrc = `//player.bilibili.com/player.html?bvid=${replay.bvid}&page=${currentPage}&high_quality=1&danmaku=0`;

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) {
      return;
    }

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      return;
    }

    await document.exitFullscreen();
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < replay.videos;

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative bg-black",
        isFullscreen ? "fixed inset-0 z-50" : "aspect-video w-full rounded-lg overflow-hidden",
        className
      )}
    >
      <iframe
        key={iframeSrc}
        src={iframeSrc}
        allowFullScreen
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
        {replay.videos > 1 ? (
          <div className="pointer-events-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-white">
              P{currentPage}/{replay.videos}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div />
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="pointer-events-auto ml-auto h-8 w-8 text-white hover:bg-white/20"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
