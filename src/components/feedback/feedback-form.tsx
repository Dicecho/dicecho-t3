"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/lib/i18n/react";
import { FEEDBACK_TYPE_OPTIONS, type FeedbackType } from "./constants";

interface FeedbackFormProps {
  onSubmit: (data: { type: FeedbackType; title: string; body: string }) => void;
  isPending?: boolean;
}

export function FeedbackForm({ onSubmit, isPending }: FeedbackFormProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<FeedbackType>("feature");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isValid = title.trim().length > 0 && body.trim().length > 0 && agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ type, title: title.trim(), body: body.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">{t("feedback_type")}</Label>
        <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FEEDBACK_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t("feedback_title")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("feedback_title_placeholder")}
          maxLength={256}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t("feedback_body")}</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t("feedback_body_placeholder")}
          rows={6}
          className="resize-none"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="agree"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
        <Label htmlFor="agree" className="text-sm leading-tight text-muted-foreground">
          {t("feedback_privacy_notice")}
        </Label>
      </div>

      <Button type="submit" disabled={!isValid || isPending} className="w-full">
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
