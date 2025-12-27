"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FoldableContentProps {
  children: React.ReactNode;
  /** Whether content should be foldable */
  foldable?: boolean;
  /** Whether content is folded by default */
  defaultFolded?: boolean;
  /** Custom className applied when content is folded (e.g., "max-h-85") */
  foldedClassName?: string;
  /** Custom className for the button container when folded (gradient background, etc.) */
  foldedButtonContainerClassName?: string;
  /** Text for expand button */
  expandText?: string;
  /** Text for collapse button */
  collapseText?: string;
  /** Custom className for the content wrapper */
  className?: string;
}

export const FoldableContent: React.FC<FoldableContentProps> = ({
  children,
  foldable = true,
  defaultFolded = true,
  foldedClassName = "max-h-85",
  foldedButtonContainerClassName = "z-1 -mt-20 mb-0 bg-linear-to-b from-card/30 to-card",
  expandText = "Expand",
  collapseText = "Collapse",
  className,
}) => {
  const [isFolded, setIsFolded] = useState(defaultFolded);

  if (!foldable) {
    return <div className={cn("flex w-full", className)}>{children}</div>;
  }

  return (
    <>
      <div
        className={cn(
          "flex w-full",
          isFolded && ["overflow-hidden", foldedClassName],
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "relative flex h-20 w-full items-center justify-center",
          isFolded && foldedButtonContainerClassName
        )}
      >
        <Button onClick={() => setIsFolded((prev) => !prev)}>
          {isFolded ? expandText : collapseText}
        </Button>
      </div>
    </>
  );
};
