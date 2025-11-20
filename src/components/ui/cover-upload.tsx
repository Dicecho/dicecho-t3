'use client';

import { useState, useEffect } from 'react';
import { useFileUpload, type FileMetadata, type FileWithPreview } from '@/hooks/use-file-upload';
import { useUploadOSS } from '@/hooks/use-uploader-assume';
import { Button } from '@/components/ui/button';
import { CloudUpload, ImageIcon, Upload, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/react';
import { toast } from '@/components/ui/use-toast';

interface CoverUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
  maxSize?: number;
  accept?: string;
  className?: string;
}

export default function CoverUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  className,
}: CoverUploadProps) {
  const { t } = useTranslation();
  const { upload, isUploading, progress } = useUploadOSS();

  const [coverImage, setCoverImage] = useState<FileWithPreview | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize with existing value
  useEffect(() => {
    if (value && !coverImage) {
      setCoverImage({
        id: 'existing-cover',
        file: {
          id: 'existing-cover',
          name: 'cover.jpg',
          size: 0,
          type: 'image/jpeg',
          url: value,
        },
        preview: value,
      });
    }
  }, [value, coverImage]);

  const [
    { isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesAdded: async (files) => {
      const file = files[0]?.file;
      if (!(file instanceof File)) return;

      setImageLoading(true);
      setUploadError(null);
      setCoverImage(files[0] ?? null);

      try {
        const result = await upload(file);
        onChange?.(result.url);
        toast({
          title: t('upload_success'),
        });
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : t('upload_failed'));
        toast({
          title: t('error'),
          description: t('upload_failed'),
          variant: 'destructive',
        });
        setCoverImage(null);
      } finally {
        setImageLoading(false);
      }
    },
  });

  const removeCoverImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
    setImageLoading(false);
    setUploadError(null);
    onChange?.(null);
  };

  const retryUpload = () => {
    setUploadError(null);
    openFileDialog();
  };

  const hasImage = coverImage && coverImage.preview;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Cover Upload Area */}
      <div
        className={cn(
          'group relative w-full h-full overflow-hidden rounded-xl transition-all duration-200 border border-border',
          isDragging
            ? 'border-dashed border-primary bg-primary/5'
            : hasImage
              ? 'border-border bg-background hover:border-primary/50'
              : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input {...getInputProps()} className="sr-only" />

        {hasImage ? (
          <>
            {/* Cover Image Display */}
            <div className="relative h-full w-full">
              {/* Loading placeholder */}
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-5" />
                    <span className="text-sm">{t('loading')}</span>
                  </div>
                </div>
              )}

              {/* Actual image */}
              <img
                src={coverImage.preview}
                alt="Cover Image"
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  imageLoading ? 'opacity-0' : 'opacity-100',
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />

              {/* Action buttons overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex flex-col gap-2">
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
                    <Upload />
                    {t('cover_change')}
                  </Button>
                  <Button onClick={removeCoverImage} variant="destructive" size="sm" type="button">
                    <XIcon />
                    {t('remove')}
                  </Button>
                </div>
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="relative">
                    <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-white/20"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        className="text-white transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center"
            onClick={openFileDialog}
          >
            <div className="rounded-full bg-primary/10 p-4">
              <CloudUpload className="size-8 text-primary" />
            </div>

            <Button variant="outline" size="sm" type="button">
              <ImageIcon />
              {t('cover_browse')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
