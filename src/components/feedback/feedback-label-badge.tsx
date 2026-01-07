import { Badge } from "@/components/ui/badge";
import type { RouterOutputs } from "@/trpc/react";

type IssueLabel = RouterOutputs["feedback"]["list"]["issues"][number]["labels"][number];
type LabelObject = Exclude<IssueLabel, string>;

interface FeedbackLabelBadgeProps {
  label: LabelObject;
}

export function FeedbackLabelBadge({ label }: FeedbackLabelBadgeProps) {
  const color = label.color ?? "94a3b8";
  const textColor = getContrastColor(color);

  return (
    <Badge
      variant="outline"
      className="border-0 text-xs font-medium"
      style={{
        backgroundColor: `#${color}`,
        color: textColor,
      }}
    >
      {label.name ?? ""}
    </Badge>
  );
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
