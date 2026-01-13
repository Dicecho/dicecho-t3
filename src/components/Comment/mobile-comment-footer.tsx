"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";

interface MobileCommentFooterProps {
  placeholder?: string;
  replyTargetId?: string;
  replyToName?: string;
  replyToContent?: string;
  onSubmit: (content: string) => Promise<void>;
  onClearReply?: () => void;
  className?: string;
}

export const MobileCommentFooter: React.FC<MobileCommentFooterProps> = ({
  placeholder,
  replyTargetId,
  replyToName,
  replyToContent,
  onSubmit,
  onClearReply,
  className,
}) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const actualPlaceholder = replyToName
    ? `${t("reply_to")} @${replyToName}`
    : placeholder ?? t("comment_placeholder");

  // Focus textarea when reply target changes
  useEffect(() => {
    if (replyTargetId && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [replyTargetId]);

  const mutation = useMutation({
    mutationFn: (content: string) => onSubmit(content),
    onSuccess: () => {
      setValue("");
      onClearReply?.();
      toast.success(t("comment_submit"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handleSubmit = () => {
    const content = value.trim();
    if (!content || mutation.isPending) return;
    mutation.mutate(content);
  };

  if (status === "loading") {
    return null;
  }

  if (status !== "authenticated") {
    return (
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-5 border-t bg-background px-4 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex-1 text-sm text-muted-foreground">
            {t("comment_login_prompt")}
          </span>
          <AuthDialog>
            <Button size="sm" variant="outline">
              {t("comment_login_button")}
            </Button>
          </AuthDialog>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-5 border-t bg-background px-4 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden",
        className
      )}
    >
      {/* Reply context header */}
      {replyToName && (
        <div className="mb-2 flex items-start justify-between gap-2 border-l-2 border-primary/50 pl-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="text-xs font-medium">
              {t("reply_to")} @{replyToName}
            </div>
            {replyToContent && (
              <div className="truncate text-xs text-muted-foreground">
                {replyToContent}
              </div>
            )}
          </div>
          {onClearReply && (
            <button
              type="button"
              onClick={onClearReply}
              className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={actualPlaceholder}
          disabled={mutation.isPending}
          className="min-h-[40px] flex-1 resize-none border-0 bg-black/20 py-2"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div
          className={cn(
            "transition-all duration-300",
            value.trim()
              ? "pointer-events-auto ml-0 w-auto translate-x-0 opacity-100"
              : "pointer-events-none -ml-16 w-16 translate-x-full opacity-0"
          )}
        >
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={mutation.isPending || !value.trim()}
            className="h-10 px-4"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
