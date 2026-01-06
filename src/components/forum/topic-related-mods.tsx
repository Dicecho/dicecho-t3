"use client";

import { LinkWithLng } from "@/components/Link";
import { ScenarioWidget } from "@/components/Scenario/widget";

interface RelatedMod {
  _id: string;
  title: string;
  coverUrl?: string;
  description?: string;
  rateAvg?: number;
  rateCount?: number;
}

interface TopicRelatedModsProps {
  mods: RelatedMod[];
}

export function TopicRelatedMods({ mods }: TopicRelatedModsProps) {
  if (!mods || mods.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {mods.map((mod) => (
        <LinkWithLng key={mod._id} href={`/scenario/${mod._id}`}>
          <ScenarioWidget scenario={mod} variant="compact" />
        </LinkWithLng>
      ))}
    </div>
  );
}
