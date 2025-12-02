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
  const { element, children, ...attributes } = props;
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const { t } = useTranslation();
  const summaryPlaceholder = t("details_summary_placeholder", {
    defaultValue: "填写预警标题",
  });

  React.useEffect(() => {
    if (readOnly) return;

    const legacySummary = (element as { summary?: string }).summary;
    const hasChildren =
      Array.isArray(element.children) && element.children.length > 0;
    const hasContent =
      Array.isArray(element.children) && element.children.length > 1;

    const path = editor.api.findPath(element);
    if (!path) return;

    editor.tf.withoutNormalizing(() => {
      if (legacySummary === undefined && hasChildren && hasContent) {
        return;
      }

      if (legacySummary !== undefined) {
        editor.tf.insertNodes(createParagraphNode(legacySummary), {
          at: [...path, 0],
        });
        if (!hasContent) {
          editor.tf.insertNodes(createParagraphNode(""), {
            at: [...path, 1],
          });
        }
        editor.tf.unsetNodes(["summary"], { at: path });
        return;
      }

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

  }, [editor, element, readOnly]);

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

  const renderSummaryContent = summaryNode ?? summaryFallback;

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
            "before:border-r-[5px] before:border-l-[5px] before:border-r-transparent before:border-l-transparent",
            "before:border-t-foreground/60 before:border-t-[5px]",
            "before:transition-transform before:duration-200",
            "[&_p]:m-0",
          )}
          contentEditable={false}
        >
          {renderSummaryContent}
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
