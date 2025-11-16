'use client';

import * as React from 'react';

import type { PlateElementProps } from 'platejs/react';

import {
  PlateElement,
  useReadOnly,
  useEditorRef,
} from 'platejs/react';

import { cn } from '@/lib/utils';

export function DetailsElement(props: PlateElementProps) {
  const { element, children, ...attributes } = props;
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const summary = (element as { summary?: string }).summary || '';
  
  const [_summary, setSummary] = React.useState(summary);
  const [isComposition, setIsComposition] = React.useState(false);

  React.useEffect(() => {
    setSummary(summary);
  }, [summary]);

  const saveData = React.useCallback((value: string) => {
    const path = editor.api.findPath(element);
    if (path) {
      editor.tf.setNodes(
        { summary: value },
        { at: path }
      );
    }
  }, [editor, element]);

  if (readOnly) {
    return (
      <PlateElement
        {...attributes}
        element={element}
        as="details"
        className={cn(
          'rounded overflow-hidden border border-border/50',
          'bg-muted/30 dark:bg-muted/20',
          attributes.className
        )}
      >
        <summary 
          className={cn(
            'px-4 py-2 cursor-pointer',
            'font-medium text-foreground',
            'bg-[linear-gradient(45deg,rgba(234,192,69,0.3)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.3)_50%,rgba(234,192,69,0.3)_75%,transparent_75%,transparent)]',
            'dark:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))]',
            'bg-size-[40px_40px]',
            'hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,transparent_75%,transparent)]',
            'dark:hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.5)_25%,rgba(0,0,0,0.4)_25%,rgba(0,0,0,0.4)_50%,rgba(234,192,69,0.5)_50%,rgba(234,192,69,0.5)_75%,rgba(0,0,0,0.4)_75%,rgba(0,0,0,0.4))]',
            'transition-colors',
            '[&::-webkit-details-marker]:hidden',
            'flex items-center gap-2 pl-6',
            'relative',
            'before:content-[""] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2',
            'before:w-0 before:h-0',
            'before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent',
            'before:border-t-[5px] before:border-t-foreground/60',
            'before:transition-transform before:duration-200'
          )}
          contentEditable={false}
        >
          {summary}
        </summary>
        <div 
          className={cn(
            'p-4',
            'bg-muted/50 dark:bg-muted/30',
            'border-t border-border/30'
          )}
          contentEditable={false}
        >
          {children}
        </div>
      </PlateElement>
    );
  }

  return (
    <PlateElement
      {...attributes}
      element={element}
      className={cn(
        'rounded overflow-hidden border border-border/50',
        'bg-muted/30 dark:bg-muted/20',
        attributes.className
      )}
    >
      <div 
        contentEditable={false} 
        className={cn(
          'font-medium text-foreground',
          'bg-[linear-gradient(45deg,rgba(234,192,69,0.3)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.3)_50%,rgba(234,192,69,0.3)_75%,transparent_75%,transparent)]',
          'dark:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))]',
          'bg-size-[40px_40px]'
        )}
      >
        <input
          autoComplete="off"
          data-testid="DetailsElementSummary"
          className={cn(
            'w-full px-4 py-2',
            'bg-transparent outline-none border-0',
            'text-foreground placeholder:text-muted-foreground',
            'focus:ring-0 focus:ring-offset-0'
          )}
          value={_summary}
          placeholder="填写预警标题"
          onCompositionStart={() => setIsComposition(true)}
          onCompositionEnd={() => {
            setIsComposition(false);
            saveData(_summary);
          }}
          onChange={(e) => {
            setSummary(e.target.value);
            if (!isComposition) {
              saveData(e.target.value);
            }
          }}
        />
      </div>
      <div 
        className={cn(
          'p-4',
          'bg-muted/50 dark:bg-muted/30',
          'border-t border-border/30'
        )}
      >
        {children}
      </div>
    </PlateElement>
  );
}

