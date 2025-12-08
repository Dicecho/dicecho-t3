import { Suspense } from "react";
import type { Metadata } from "next";
import { ScenarioDetailServer } from "./scenario-detail";
import { ScenarioDetailSkeleton } from "./scenario-detail-skeleton";
import { getDicechoServerApi } from "@/server/dicecho";

// Let Next.js decide the rendering strategy based on usage
export const dynamic = 'auto';

// ISR with 5 minutes revalidation (scenario details change less frequently)
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const api = await getDicechoServerApi();
    const scenario = await api.module.detail(id, { revalidate: 300 });

    const title = scenario.originTitle || scenario.title;
    const baseDescription = scenario.description || `${scenario.title} - TRPG scenario on DiceEcho`;

    // Add rating info to description for OG
    const ratingInfo = scenario.rateCount > 0
      ? `★ ${scenario.rateAvg}/10 (${scenario.rateCount} reviews)`
      : '';
    const description = ratingInfo
      ? `${ratingInfo}\n\n${baseDescription}`
      : baseDescription;

    const imageUrl = scenario.coverUrl;

    return {
      title,
      description: baseDescription, // Use base description for meta description
      openGraph: {
        title,
        description, // Use enhanced description with rating for OG
        images: imageUrl ? [{
          url: imageUrl,
          width: 800,
          height: 1067, // 3:4 aspect ratio
          alt: title,
        }] : [],
        type: 'article',
        siteName: 'DiceEcho',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata for scenario:', id, error);
    return {
      title: 'Scenario - DiceEcho',
      description: 'TRPG scenario on DiceEcho',
    };
  }
}

const ScenarioDetailPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const { lng, id } = await params;

  return (
    <Suspense fallback={<ScenarioDetailSkeleton />}>
      <ScenarioDetailServer lng={lng} id={id} />
    </Suspense>
  );
};

export default ScenarioDetailPage;
