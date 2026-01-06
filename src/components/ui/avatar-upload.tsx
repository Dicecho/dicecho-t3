"use client";

import { useState, useEffect } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useUploadOSS } from "@/hooks/use-uploader-assume";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  size?: number;
  className?: string;
}

export default function AvatarUpload({
  value,
  onChange,
  size = 96,
  className,
}: AvatarUploadProps) {
  const { t } = useTranslation();
  const { upload, isUploading, progress } = useUploadOSS();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(value ?? null);
  }, [value]);

  const [
    { isDragging },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: "image/*",
    multiple: false,
    onFilesAdded: async (files) => {
      const file = files[0]?.file;
      if (!(file instanceof File)) return;

      // Show preview immediately
      setPreviewUrl(files[0]?.preview ?? null);

      try {
        const result = await upload(file);
        onChange?.(result.url);
        toast.success(t("avatar_updated"));
      } catch (error) {
        toast.error(t("upload_failed"));
        setPreviewUrl(value ?? null);
      }
    },
  });

  return (
    <div
      className={cn("relative cursor-pointer group", className)}
      style={{ width: size, height: size }}
      onClick={openFileDialog}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input {...getInputProps()} className="sr-only" />

      {/* Avatar Image */}
      <div
        className={cn(
          "w-full h-full rounded-full overflow-hidden bg-cover bg-center",
          isDragging && "ring-2 ring-primary ring-offset-2"
        )}
        style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : undefined }}
      />

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isUploading && "opacity-100"
        )}
      >
        {isUploading ? (
          <div className="relative">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/20"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                className="text-white transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-white animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-white text-xs">
            <Upload className="h-5 w-5 mb-1" />
          </div>
        )}
      </div>
    </div>
  );
}
