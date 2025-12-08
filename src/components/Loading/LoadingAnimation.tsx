"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./LoadingAnimation.module.css";
import dice from "./dice.png";

interface LoadingAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
}

export function LoadingAnimation({
  width = 120,
  className,
  style,
  ...props
}: LoadingAnimationProps) {
  return (
    <div
      className={cn(styles.wrapper, className)}
      style={{
        width: `${width}px`,
        height: `${width}px`,
        "--dice-width": `${width}px`,
        backgroundImage: `url(${dice.src})`,
        ...style,
      } as React.CSSProperties & { "--dice-width": string }}
      {...props}
    />
  );
}
