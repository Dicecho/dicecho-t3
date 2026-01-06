"use client";

import { useState, useEffect } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useUploadOSS } from "@/hooks/use-uploader-assume";
import { Button } from "@/components/ui/button";
import { CloudUpload, ImageIcon, Upload, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";

interface BackgroundUploadProps {
  value?: string;
  onChange?: (url: string | undefined) => void;
  maxSize?: number;
  accept?: string;
  className?: string;
}

export default function BackgroundUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  className,
}: BackgroundUploadProps) {
  const { t } = useTranslation();
  const { upload, isUploading, progress } = useUploadOSS();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const [
    { isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesAdded: async (files) => {
      const file = files[0]?.file;
      if (!(file instanceof File)) return;
      setImageUrl(files[0]?.preview ?? undefined);

      try {
        const result = await upload(file);
        onChange?.(result.url);
        toast.success(t("upload_success"));
      } catch (error) {
        toast.error(t("upload_failed"), {
          description: error instanceof Error ? error.message : t("upload_failed"),
        });
        setImageUrl(value);
      }
    },
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(undefined);
    onChange?.(undefined);
  };

  const hasImage = !!imageUrl;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "group relative w-full aspect-[3/1] overflow-hidden rounded-lg transition-all duration-200 border",
          isDragging
            ? "border-dashed border-primary bg-primary/5"
            : hasImage
              ? "border-border bg-background hover:border-primary/50"
              : "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        {hasImage ? (
          <>
            <div className="relative h-full w-full">
              {isUploading && (
                <div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-5" />
                    <span className="text-sm">{t("loading")}</span>
                  </div>
                </div>
              )}

              <img
                src={imageUrl}
                alt="Background"
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-300",
                  isUploading ? "opacity-0" : "opacity-100"
                )}
              />

              <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  >
                    <Upload className="size-4 mr-1" />
                    {t("cover_change")}
                  </Button>
                  <Button
                    onClick={removeImage}
                    variant="destructive"
                    size="sm"
                    type="button"
                  >
                    <XIcon className="size-4 mr-1" />
                    {t("remove")}
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="relative">
                    <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-white/20"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                        className="text-white transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center"
            onClick={openFileDialog}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <CloudUpload className="size-6 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              {t("profile_background_upload_hint")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
