"use client";

import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileImageIcon,
  FileAudioIcon,
  FileVideoIcon,
  FileSpreadsheetIcon,
  FileTypeIcon,
  FileCodeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/react";
import { trackScenarioDownload } from "@/lib/analytics";
import type { IModDto } from "@dicecho/types";

interface ScenarioDownloadProps {
  scenario: IModDto;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(fileName: string, fileType?: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const type = fileType?.toLowerCase() ?? "";

  // Archive files
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext) || type.includes("archive") || type.includes("zip")) {
    return FileArchiveIcon;
  }

  // PDF
  if (ext === "pdf" || type.includes("pdf")) {
    return FileTextIcon;
  }

  // Word documents
  if (["doc", "docx", "odt", "rtf"].includes(ext) || type.includes("word") || type.includes("document")) {
    return FileTypeIcon;
  }

  // Spreadsheets
  if (["xls", "xlsx", "csv", "ods"].includes(ext) || type.includes("excel") || type.includes("spreadsheet")) {
    return FileSpreadsheetIcon;
  }

  // Images
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext) || type.includes("image")) {
    return FileImageIcon;
  }

  // Audio
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext) || type.includes("audio")) {
    return FileAudioIcon;
  }

  // Video
  if (["mp4", "avi", "mkv", "mov", "wmv", "webm"].includes(ext) || type.includes("video")) {
    return FileVideoIcon;
  }

  // Code/text files
  if (["txt", "md", "json", "xml", "html", "css", "js", "ts"].includes(ext) || type.includes("text")) {
    return FileCodeIcon;
  }

  return FileIcon;
}

export function ScenarioDownload({ scenario }: ScenarioDownloadProps) {
  const { t } = useTranslation();

  if (!scenario.modFiles || scenario.modFiles.length === 0) {
    return null;
  }

  return (
    <Card className="gap-4 max-md:rounded-none">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          {t("scenario_files")}
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-dashed">
        {scenario.modFiles.map((file) => {
          const Icon = getFileIcon(file.name, file.type);
          return (
            <div
              key={file.name}
              className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Icon size={40} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{file.name}</div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    {file.size > 0 && <span>{formatFileSize(file.size)}</span>}
                    {file.clickCount !== undefined && file.clickCount > 0 && (
                      <span>
                        {t("download_count", { count: file.clickCount })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  trackScenarioDownload(scenario._id, scenario.title);
                  window.open(file.url, "_blank", "noopener,noreferrer");
                }}
              >
                <DownloadIcon size={16} />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
