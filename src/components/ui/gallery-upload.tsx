'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFileUpload, type FileMetadata } from '@/hooks/use-file-upload';
import { useUploadOSS } from '@/hooks/use-uploader-assume';
import { Button } from '@/components/ui/button';
import { CloudUpload, XIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/react';
import { toast } from 'sonner';

interface PendingImage {
  id: string;
  previewUrl: string;
  status: 'uploading' | 'success' | 'error';
}

interface GalleryUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
}

export default function GalleryUpload({
  value = [],
  onChange,
  maxFiles = 20,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
  className,
}: GalleryUploadProps) {
  const { t } = useTranslation();
  const { upload } = useUploadOSS();

  const [images, setImages] = useState<string[]>(value);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    setImages(value);
  }, [value]);

  const uploadFile = useCallback(
    async (id: string, file: File, previewUrl: string) => {
      try {
        const result = await upload(file);
        URL.revokeObjectURL(previewUrl);
        setPendingImages((prev) => prev.filter((p) => p.id !== id));
        const newImages = [...imagesRef.current, result.url];
        setImages(newImages);
        onChange?.(newImages);
        toast.success(t('upload_success'));
      } catch (error) {
        setPendingImages((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'error' as const } : p)));
        toast.error(t('upload_failed'), {
          description: error instanceof Error ? error.message : t('upload_failed'),
        });
      }
    },
    [upload, onChange, t],
  );

  const [
    { isDragging },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple: true,
    onFilesAdded: (files) => {
      const newPending: PendingImage[] = [];

      for (const fileItem of files) {
        const file = fileItem.file;
        if (!(file instanceof File)) continue;

        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);
        newPending.push({ id, previewUrl, status: 'uploading' });

        uploadFile(id, file, previewUrl);
      }

      setPendingImages((prev) => [...prev, ...newPending]);
    },
  });

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      onChange?.(newImages);
      return newImages;
    });
  };

  const canAddMore = images.length + pendingImages.length < maxFiles;

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img src={url} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => removeImage(index)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {pendingImages.map((pending) => (
          <div
            key={pending.id}
            className="relative aspect-square overflow-hidden rounded-lg border border-dashed border-primary bg-muted"
          >
            <img src={pending.previewUrl} alt="Uploading" className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              {pending.status === 'uploading' && <Loader2 className="size-8 animate-spin text-white" />}
              {pending.status === 'error' && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    URL.revokeObjectURL(pending.previewUrl);
                    setPendingImages((prev) => prev.filter((p) => p.id !== pending.id));
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {canAddMore && (
          <div
            className={cn(
              'relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border transition-all duration-200',
              isDragging
                ? 'border-dashed border-primary bg-primary/5'
                : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5',
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input {...getInputProps()} className="sr-only" />
            <CloudUpload className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('upload')}</span>
          </div>
        )}
      </div>

      {(images.length > 0 || pendingImages.length > 0) && (
        <p className="text-xs text-muted-foreground">
          {images.length + pendingImages.length} / {maxFiles} {t('images')}
        </p>
      )}
    </div>
  );
}
