"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { trackShare } from "@/lib/analytics";

interface ShareButtonProps {
  url: string;
  title?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export function ShareButton({
  url,
  title,
  variant = "secondary",
  size = "sm",
  className,
  children,
  asChild = false,
}: ShareButtonProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const copyToClipboard = () => {
    trackShare(url, "clipboard");
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(t("share_link_copied"));
      })
      .catch(() => {
        toast.error(t("share_link_failed"));
      });
  };

  const handleShare = async () => {
    if (!isMobile) {
      copyToClipboard();
      return;
    }

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        trackShare(url, "native");
        await navigator.share({
          title: title || document.title,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };

  if (asChild) {
    return (
      <Slot onClick={handleShare}>
        {children}
      </Slot>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      {children && <span>{children}</span>}
    </Button>
  );
}
