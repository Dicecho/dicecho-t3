"use client";

import clsx from "clsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";

interface ScenarioDescriptionProps {
  text?: string;
  maxLines?: number;
  className?: string;
}

export function ScenarioDescription({
  text,
  maxLines = 4,
  className,
}: ScenarioDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const shouldShowToggle = text.length > 120;
  const clampClass = expanded
    ? ""
    : {
        3: "line-clamp-3",
        4: "line-clamp-4",
        5: "line-clamp-5",
      }[maxLines] ?? "line-clamp-4";

  return (
    <div className={clsx("space-y-2", className)}>
      <article
        className={clsx(
          "whitespace-pre-line wrap-break-words",
          clampClass,
        )}
      >
        {text}
      </article>
      {shouldShowToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-0 text-primary"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? t("scenario_description_collapse") : t("scenario_description_expand")}
          {expanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
