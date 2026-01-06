"use client";

import { TopicFormDialog } from "@/components/forum/topic-form-dialog";
import type { SimpleModDto } from "@/components/forum/topic-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";

interface CreateTopicButtonProps {
  scenario: SimpleModDto;
  className?: string;
}

export function CreateTopicButton({ scenario, className }: CreateTopicButtonProps) {
  const { t } = useTranslation();

  return (
    <TopicFormDialog defaultRelatedMod={scenario}>
      <Button size="sm" className={className}>
        <Plus size={16} />
        {t("topic_create")}
      </Button>
    </TopicFormDialog>
  );
}
