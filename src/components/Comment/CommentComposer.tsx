"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { RichTextEditor } from '@/components/Editor'

interface CommentComposerProps {
  placeholder: string;
  onSubmit: (content: string) => Promise<void>;
  className?: string;
  mode?: "rich" | "simple";
  autoFocus?: boolean;
  showCancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  disabled?: boolean;
}

export const CommentComposer: React.FC<CommentComposerProps> = (props) => {
  const { t } = useTranslation();
  const { status } = useSession();

  
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const content = value.trim();
    if (!content || submitting || props.disabled) {
      return;
    }
    setSubmitting(true);
    try {
      await props.onSubmit(content);
      setValue("");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (status !== "authenticated") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground",
          props.className,
        )}
      >
        <span>{t("comment_login_prompt")}</span>
        <AuthDialog>
          <Button size="sm" className="h-8 px-3 text-xs" variant="outline">
            {t("comment_login_button")}
          </Button>
        </AuthDialog>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-2 rounded-2xl bg-muted/20 p-3",
        props.className,
      )}
    >
      {props.mode === "rich" ? (
        <RichTextEditor
          onMarkdownChange={(markdown) => {
            console.log('markdown', markdown);
            setValue(markdown)
          }}
          markdown={value}
        />
      ) : (
        <Textarea
          value={value}
          autoFocus={props.autoFocus}
          onChange={(event) => setValue(event.target.value)}
          placeholder={props.placeholder}
          disabled={submitting || props.disabled}
          className="min-h-[48px]"
        />
      )}
      <div className="flex justify-end gap-2">
        {props.showCancel && (
          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            variant="ghost"
            onClick={props.onCancel}
            disabled={submitting}
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={handleSubmit}
          disabled={submitting || !value.trim() || props.disabled}
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("comment_submit")}
        </Button>
      </div>
    </div>
  );
};