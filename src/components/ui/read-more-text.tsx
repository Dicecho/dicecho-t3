"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";

interface ReadMoreTextProps {
  children: React.ReactNode;
  className?: string;
  lines?: number;
}

export function ReadMoreText({
  children,
  className,
  lines = 1,
}: ReadMoreTextProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const checkTruncation = useCallback(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight + 1);
    }
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      checkTruncation();

      const resizeObserver = new ResizeObserver(checkTruncation);
      if (textRef.current) {
        resizeObserver.observe(textRef.current);
      }

      return () => resizeObserver.disconnect();
    }
  }, [children, checkTruncation, isExpanded]);

  const lineClampClass = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
    5: "line-clamp-5",
    6: "line-clamp-6",
  }[lines] || "line-clamp-1";

  // 如果文本没被截断，直接显示
  if (!isTruncated && !isExpanded) {
    return (
      <div
        ref={textRef}
        className={cn("whitespace-pre-line", lineClampClass, className)}
      >
        {children}
      </div>
    );
  }

  if (isExpanded) {
    return (
      <div className={cn("whitespace-pre-line", className)}>
        {children}
        <button
          onClick={() => setIsExpanded(false)}
          className="text-primary hover:text-primary/80 ml-1 inline"
        >
          {t("collapse")}
        </button>
      </div>
    );
  }

  // 折叠状态 - 使用 float 让按钮出现在文本末尾
  const lineHeight = 1.5; // 对应 Tailwind 默认的 leading-normal
  const buttonMarginTop = `calc(${(lines - 1) * lineHeight}em)`;

  return (
    <div className={cn("overflow-hidden", className)}>
      <button
        onClick={() => setIsExpanded(true)}
        className="text-primary hover:text-primary/80 float-right clear-both"
        style={{ marginTop: buttonMarginTop }}
      >
        ...{t("expand")}
      </button>
      <div
        ref={textRef}
        className={cn("whitespace-pre-line", lineClampClass)}
      >
        {children}
      </div>
    </div>
  );
}
