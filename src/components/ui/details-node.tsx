"use client";

import * as React from "react";

import type { PlateElementProps } from "platejs/react";

import { PlateElement, useReadOnly, useEditorRef } from "platejs/react";
import { KEYS, NodeApi } from "platejs";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";

const createParagraphNode = (text = "") => ({
  type: KEYS.p,
  children: [{ text }],
});

export function DetailsElement(props: PlateElementProps) {
  const didRun = React.useRef(false);
  const { element, children, ...attributes } = props;
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const { t } = useTranslation();
  const summaryPlaceholder = t("details_summary_placeholder");

  React.useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const path = editor.api.findPath(element);
    if (!path) return;

    const legacySummary = (element as { summary?: string }).summary;
    const hasChildren =
      Array.isArray(element.children) && element.children.length > 0;
    const hasContent =
      Array.isArray(element.children) && element.children.length > 1;

    // 如果已经是新格式且结构完整，直接返回
    if (legacySummary === undefined && hasChildren && hasContent) {
      return;
    }

    editor.tf.withoutNormalizing(() => {
      // 处理旧格式：有 summary 属性的情况
      if (legacySummary !== undefined) {
        // 插入 summary 段落到 [0] 位置，原有 children 会被推到后面
        editor.tf.insertNodes(createParagraphNode(legacySummary), {
          at: [...path, 0],
        });
        // 如果没有 content，添加一个空的 content 段落
        if (!hasChildren) {
          editor.tf.insertNodes(createParagraphNode(""), {
            at: [...path, 1],
          });
        }
        editor.tf.unsetNodes(["summary"], { at: path });
        return;
      } else {
        if (!hasChildren) {
          editor.tf.insertNodes(createParagraphNode(""), {
            at: [...path, 0],
          });
        }

        if (!hasContent) {
          editor.tf.insertNodes(createParagraphNode(""), {
            at: [...path, 1],
          });
        }
      }
    });

    const nextEntry = editor.api.next({ at: path });
    if (!nextEntry) {
      const nextPath = [...path];
      const lastIndex = nextPath.length - 1;
      nextPath[lastIndex] = (nextPath[lastIndex] ?? 0) + 1;

      editor.tf.insertNodes(createParagraphNode(""), {
        at: nextPath,
      });
    }
  }, [editor, element]);

  const childNodes = React.Children.toArray(children);
  const summaryNode = childNodes[0];
  const contentNodes = childNodes.slice(1);
  const summaryText = React.useMemo(() => {
    const summaryElement = (element.children ?? [])[0];
    if (!summaryElement) return "";
    return NodeApi.string(summaryElement as any).trim();
  }, [element.children]);

  const summaryFallback = React.useMemo(
    () =>
      React.createElement(
        "div",
        { className: "px-4 py-2 min-h-10 text-sm text-muted-foreground/20" },
        summaryPlaceholder,
      ),
    [summaryPlaceholder],
  );


  const summaryEditableContent = summaryNode ? (
    <div
      className={cn(
        "relative min-h-10 px-4 py-2 focus:outline-none **:data-[slate-node='element']:m-0 **:data-[slate-node='element']:p-0",
        { ["text-muted-foreground"]: !summaryText },
      )}
      data-details-summary-placeholder={
        summaryText ? undefined : summaryPlaceholder
      }
    >
      {summaryNode}
    </div>
  ) : (
    summaryFallback
  );

  if (readOnly) {
    return (
      <PlateElement
        {...attributes}
        element={element}
        as="details"
        className={cn(
          "border-border/50 mb-1 overflow-hidden rounded border",
          "bg-muted/30 dark:bg-muted/20",
          attributes.className,
        )}
      >
        <summary
          className={cn(
            "min-h-10",
            "cursor-pointer px-4 py-2",
            "text-foreground font-medium",
            "bg-[linear-gradient(45deg,rgba(234,192,69,0.3)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.3)_50%,rgba(234,192,69,0.3)_75%,transparent_75%,transparent)]",
            "dark:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))]",
            "bg-size-[40px_40px]",
            "hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,transparent_75%,transparent)]",
            "dark:hover:bg-[linear-gradient(45deg,rgba(234,192,69,0.5)_25%,rgba(0,0,0,0.4)_25%,rgba(0,0,0,0.4)_50%,rgba(234,192,69,0.5)_50%,rgba(234,192,69,0.5)_75%,rgba(0,0,0,0.4)_75%,rgba(0,0,0,0.4))]",
            "transition-colors",
            "[&::-webkit-details-marker]:hidden",
            "flex items-center gap-2 pl-6",
            "relative",
            'before:absolute before:top-1/2 before:left-2 before:-translate-y-1/2 before:content-[""]',
            "before:h-0 before:w-0",
            "before:border-t-[5px] before:border-b-[5px] before:border-t-transparent before:border-b-transparent",
            "before:border-l-foreground/60 before:border-l-[5px]",
            "before:transition-transform before:duration-200",
            "[&_p]:m-0",
          )}
          contentEditable={false}
        >
          {summaryNode ?? summaryFallback}
        </summary>
        <div
          className={cn(
            "p-4",
            "bg-muted/50 dark:bg-muted/30",
            "border-border/30 border-t",
            "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
          )}
          contentEditable={false}
        >
          {contentNodes.length > 0 ? contentNodes : null}
        </div>
      </PlateElement>
    );
  }

  return (
    <PlateElement
      {...attributes}
      element={element}
      className={cn(
        "border-border/50 overflow-hidden rounded border",
        "bg-muted/30 dark:bg-muted/20",
        attributes.className,
      )}
    >
      <div
        className={cn(
          "relative",
          "text-foreground font-medium",
          "bg-[linear-gradient(45deg,rgba(234,192,69,0.3)_25%,transparent_25%,transparent_50%,rgba(234,192,69,0.3)_50%,rgba(234,192,69,0.3)_75%,transparent_75%,transparent)]",
          "dark:bg-[linear-gradient(45deg,rgba(234,192,69,0.4)_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,rgba(234,192,69,0.4)_50%,rgba(234,192,69,0.4)_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))]",
          "bg-size-[40px_40px]",
        )}
      >
        {summaryEditableContent}
      </div>
      <div
        className={cn(
          "p-4",
          "bg-muted/50 dark:bg-muted/30",
          "border-border/30 border-t",
          "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        )}
      >
        {contentNodes.length > 0 ? contentNodes : null}
      </div>
    </PlateElement>
  );
}
