'use client';

import * as React from 'react';

import type { TPlaceholderElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import {
  PlaceholderPlugin,
  PlaceholderProvider,
  updateUploadHistory,
} from '@platejs/media/react';
import { AudioLines, FileUp, Film, ImageIcon, Loader2Icon } from 'lucide-react';
import { KEYS } from 'platejs';
import { PlateElement, useEditorPlugin, withHOC } from 'platejs/react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useUploadOSS } from '@/hooks/use-uploader-assume';

const CONTENT: Record<
  string,
  {
    accept: string[];
    content: React.ReactNode;
    icon: React.ReactNode;
  }
> = {
  [KEYS.audio]: {
    accept: ['audio/*'],
    content: 'Add an audio file',
    icon: <AudioLines />,
  },
  [KEYS.file]: {
    accept: ['*'],
    content: 'Add a file',
    icon: <FileUp />,
  },
  [KEYS.img]: {
    accept: ['image/*'],
    content: 'Add an image',
    icon: <ImageIcon />,
  },
  [KEYS.video]: {
    accept: ['video/*'],
    content: 'Add a video',
    icon: <Film />,
  },
};

export const PlaceholderElement = withHOC(
  PlaceholderProvider,
  function PlaceholderElement(props: PlateElementProps<TPlaceholderElement>) {
    const { editor, element } = props;

    const { api } = useEditorPlugin(PlaceholderPlugin);

    const [uploadedFile, setUploadedFile] = React.useState<{
      name?: string;
      url: string;
    } | null>(null);
    const [uploadingFile, setUploadingFile] = React.useState<File | null>(null);
    const { upload, isUploading, progress } = useUploadOSS();

    const loading = isUploading && Boolean(uploadingFile);

    const currentContent = CONTENT[element.mediaType] ?? CONTENT[KEYS.file];

    const accept = React.useMemo(() => {
      const accepts = currentContent?.accept;

      return Array.isArray(accepts) ? accepts.join(',') : '*';
    }, [currentContent?.accept]);

    const isImage = element.mediaType === KEYS.img;

    const imageRef = React.useRef<HTMLImageElement>(null);

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
      accept,
      multiple: true,
      onFilesAdded: (files) => {
        if (loading) {
          return;
        }

        const plainFiles = files
          .map((file) => file.file)
          .filter((file): file is File => file instanceof File);

        if (plainFiles.length === 0) {
          return;
        }

        const [firstFile, ...restFiles] = plainFiles;

        if (!firstFile) {
          return;
        }

        replaceCurrentPlaceholder(firstFile);

        if (restFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          restFiles.forEach((file) => dataTransfer.items.add(file));

          editor
            .getTransforms(PlaceholderPlugin)
            .insert.media(dataTransfer.files);
        }
      },
      onError: (errors) => {
        errors.forEach((error) =>
          toast.error(error || 'File selection failed. Please try again.')
        );
      },
    });

    const uploadMedia = React.useCallback(
      async (file: File) => {
        setUploadingFile(file);

        try {
          const result = await upload(file);

          setUploadedFile({
            name: result.name ?? file.name,
            url: result.url,
          });
        } catch (error) {
          toast.error('上传失败，请稍后重试。');
          api.placeholder.removeUploadingFile(element.id as string);
          setUploadedFile(null);
        } finally {
          setUploadingFile(null);
        }
      },
      [api.placeholder, element.id, upload]
    );

    const replaceCurrentPlaceholder = React.useCallback(
      (file: File) => {
        api.placeholder.addUploadingFile(element.id as string, file);
        void uploadMedia(file);
      },
      [api.placeholder, element.id, uploadMedia]
    );

    React.useEffect(() => {
      if (!uploadedFile) return;

      const path = editor.api.findPath(element);

      editor.tf.withoutSaving(() => {
        editor.tf.removeNodes({ at: path });

        const node = {
          children: [{ text: '' }],
          initialHeight: imageRef.current?.height,
          initialWidth: imageRef.current?.width,
          isUpload: true,
          name: element.mediaType === KEYS.file ? uploadedFile.name : '',
          placeholderId: element.id as string,
          type: element.mediaType!,
          url: uploadedFile.url,
        };

        editor.tf.insertNodes(node, { at: path });

        updateUploadHistory(editor, node);
      });

      api.placeholder.removeUploadingFile(element.id as string);
      setUploadedFile(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedFile, element.id]);

    // React dev mode will call React.useEffect twice
    const isReplaced = React.useRef(false);

    /** Paste and drop */
    React.useEffect(() => {
      if (isReplaced.current) return;

      isReplaced.current = true;
      const currentFiles = api.placeholder.getUploadingFile(
        element.id as string
      );

      if (!currentFiles) return;

      replaceCurrentPlaceholder(currentFiles);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReplaced]);

    return (
      <PlateElement className="my-1" {...props}>
        <input
          {...getInputProps({
            accept,
            multiple: true,
          })}
          className="sr-only"
        />
        {(!loading || !isImage) && (
          <div
            className={cn(
              'flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 select-none hover:bg-primary/10',
              isDragging &&
                'border border-dashed border-primary bg-primary/5 transition-colors'
            )}
            onClick={() => !loading && openFileDialog()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            contentEditable={false}
          >
            <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
              {currentContent?.icon}
            </div>
            <div className="text-sm whitespace-nowrap text-muted-foreground">
              <div>
                {loading ? uploadingFile?.name : currentContent?.content}
              </div>

              {loading && !isImage && (
                <div className="mt-1 flex items-center gap-1.5">
                  <div>{formatBytes(uploadingFile?.size ?? 0)}</div>
                  <div>–</div>
                  <div className="flex items-center">
                    <Loader2Icon className="mr-1 size-3.5 animate-spin text-muted-foreground" />
                    {progress ?? 0}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isImage && loading && (
          <ImageProgress
            file={uploadingFile}
            imageRef={imageRef}
            progress={progress}
          />
        )}

        {props.children}
      </PlateElement>
    );
  }
);

export function ImageProgress({
  className,
  file,
  imageRef,
  progress = 0,
}: {
  file: File | null;
  className?: string;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  progress?: number;
}) {
  if (!file) {
    return null;
  }

  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn('relative', className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
