"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileMentionPanelProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * 移动端底部固定面板，用于显示 mention 搜索结果
 * 使用 visualViewport API 自动适应键盘高度
 */
export function MobileMentionPanel({
  className,
  children,
}: MobileMentionPanelProps) {
  const [bottomOffset, setBottomOffset] = React.useState(0);

  React.useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updatePosition = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      setBottomOffset(Math.max(0, keyboardHeight));
    };

    updatePosition();
    viewport.addEventListener("resize", updatePosition);
    viewport.addEventListener("scroll", updatePosition);

    return () => {
      viewport.removeEventListener("resize", updatePosition);
      viewport.removeEventListener("scroll", updatePosition);
    };
  }, []);

  // 阻止触摸事件导致编辑器失焦
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
  };

  return (
    <div
      style={{ bottom: bottomOffset + 12, maxHeight: 200 }}
      className={cn(
        "fixed left-3 right-3 z-50 overflow-y-auto",
        "bg-popover border rounded-xl",
        "shadow-lg shadow-black/10",
        "animate-in slide-in-from-bottom-4 duration-200",
        className
      )}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
}
