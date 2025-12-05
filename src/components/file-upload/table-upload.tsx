'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  CloudUpload,
  Download,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  Trash2,
  TriangleAlert,
  Upload,
  VideoIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/react';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface TableUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
  initialFiles?: FileMetadata[];
}

export default function TableUpload({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
  initialFiles = [],
}: TableUploadProps) {
  const initialUploadFiles: FileUploadItem[] = initialFiles.map((file) => ({
    id: file.id ?? file.name,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    } as File,
    preview: file.url,
    progress: 100,
    status: 'completed' as const,
  }));

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>(initialUploadFiles);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  useEffect(() => {
    setUploadFiles(initialUploadFiles);
  }, [initialFiles]);

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            // Randomly decide if upload succeeds or fails
            const shouldFail = Math.random() < 0.1; // 10% chance to fail
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ('error' as const) : ('completed' as const),
              error: shouldFail ? t('file_upload.upload_failed') : undefined,
            };
          }

          return { ...file, progress: newProgress };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, progress: 0, status: 'uploading' as const, error: undefined } : file,
      ),
    );
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return <ImageIcon className="size-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="size-4" />;
    if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />;
    if (type.includes('pdf')) return <FileTextIcon className="size-4" />;
    if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-4" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-4" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const getFileTypeLabel = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return t('file_upload.type_image');
    if (type.startsWith('video/')) return t('file_upload.type_video');
    if (type.startsWith('audio/')) return t('file_upload.type_audio');
    if (type.includes('pdf')) return t('file_upload.type_pdf');
    if (type.includes('word') || type.includes('doc')) return t('file_upload.type_word');
    if (type.includes('excel') || type.includes('sheet')) return t('file_upload.type_excel');
    if (type.includes('zip') || type.includes('rar')) return t('file_upload.type_archive');
    if (type.includes('json')) return t('file_upload.type_json');
    if (type.includes('text')) return t('file_upload.type_text');
    return t('file_upload.type_file');
  };

  const { t } = useTranslation();

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-6 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors',
              isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
            )}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('file_upload.drop_files')}{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="cursor-pointer text-primary underline-offset-4 hover:underline"
              >
                {t('file_upload.browse_files')}
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              {t('file_upload.max_file_size')}: {formatBytes(maxSize)} • {t('file_upload.max_files')}: {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('file_upload.files_count', { count: uploadFiles.length })}</h3>
            <div className="flex gap-2">
              <Button onClick={openFileDialog} variant="outline" size="sm">
                <CloudUpload />
                {t('file_upload.add_files')}
              </Button>
              <Button onClick={clearFiles} variant="outline" size="sm">
                <Trash2 />
                {t('file_upload.remove_all')}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="h-9">{t('file_upload.table_name')}</TableHead>
                  <TableHead className="h-9">{t('file_upload.table_type')}</TableHead>
                  <TableHead className="h-9">{t('file_upload.table_size')}</TableHead>
                  <TableHead className="h-9 w-[100px] text-end">{t('file_upload.table_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadFiles.map((fileItem) => (
                  <TableRow key={fileItem.id}>
                    <TableCell className="py-2 ps-1.5">
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            'size-8 shrink-0 relative flex items-center justify-center text-muted-foreground/80',
                          )}
                        >
                          {fileItem.status === 'uploading' ? (
                            <div className="relative">
                              {/* Circular progress background */}
                              <svg className="size-8 -rotate-90" viewBox="0 0 32 32">
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-muted-foreground/20"
                                />
                                {/* Progress circle */}
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeDasharray={`${2 * Math.PI * 14}`}
                                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - fileItem.progress / 100)}`}
                                  className="text-primary transition-all duration-300"
                                  strokeLinecap="round"
                                />
                              </svg>
                              {/* File icon in center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                {getFileIcon(fileItem.file)}
                              </div>
                            </div>
                          ) : (
                            <div className="not-[]:size-8 flex items-center justify-center">
                              {getFileIcon(fileItem.file)}
                            </div>
                          )}
                        </div>
                        <p className="flex items-center gap-1 truncate text-sm font-medium">
                          {fileItem.file.name}
                          {fileItem.status === 'error' && (
                            <Badge variant="destructive">
                              {t('file_upload.status_error')}
                            </Badge>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(fileItem.file)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-muted-foreground">
                      {formatBytes(fileItem.file.size)}
                    </TableCell>
                    <TableCell className="py-2 pe-1">
                      <div className="flex items-center gap-1">
                        {fileItem.preview && (
                          <Button variant="dim" size="icon" className="size-8" asChild>
                            <Link href={fileItem.preview} target="_blank">
                              <Download className="size-3.5" />
                            </Link>
                          </Button>
                        )}
                        {fileItem.status === 'error' ? (
                          <Button
                            onClick={() => retryUpload(fileItem.id)}
                            variant="dim"
                            size="icon"
                            className="size-8 text-destructive/80 hover:text-destructive"
                          >
                            <RefreshCwIcon className="size-3.5" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => removeUploadFile(fileItem.id)}
                            variant="dim"
                            size="icon"
                            className="size-8"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-5">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>{t('file_upload.upload_errors_title')}</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
