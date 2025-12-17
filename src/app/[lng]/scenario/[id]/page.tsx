import type { Metadata } from "next";
import { ScenarioDetail } from "./scenario-detail";
import { ScenarioDetailHeader } from "./header";
import { getDicechoServerApi } from "@/server/dicecho";
import { notFound } from "next/navigation";

// Let Next.js decide the rendering strategy based on usage
export const dynamic = "auto";

// ISR with 5 minutes revalidation (scenario details change less frequently)
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id, { revalidate: 300 }).catch(() => null);
  if (!scenario) {
    return {
      title: "Scenario - Dicecho",
      description: "TRPG scenario on Dicecho",
    };
  }

  const title = scenario.originTitle || scenario.title;
  const baseDescription =
    scenario.description || `${scenario.title} - TRPG scenario on Dicecho`;

  // Add rating info to description for OG
  const ratingInfo =
    scenario.rateCount > 0
      ? `★ ${scenario.rateAvg}/10 (${scenario.rateCount} reviews)`
      : "";
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
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 1067, // 3:4 aspect ratio
              alt: title,
            },
          ]
        : [],
      type: "article",
      siteName: "Dicecho",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const ScenarioDetailPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const { lng, id } = await params;
  const api = await getDicechoServerApi();

  // Server-side data fetching with 300s (5min) revalidation cache
  // Scenario details change less frequently than lists
  const scenario = await api.module.detail(id, { revalidate: 300 }).catch(() => null);

  if (!scenario) {
    return notFound();
  }

  // Generate JSON-LD structured data for Google rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: scenario.originTitle || scenario.title,
    description: scenario.description || `${scenario.title} - TRPG scenario`,
    image: scenario.coverUrl,
    ...(scenario.rateCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: scenario.rateAvg,
        bestRating: 10,
        worstRating: 0,
        ratingCount: scenario.rateCount,
      },
    }),
    ...(scenario.releaseDate && {
      datePublished: scenario.releaseDate,
    }),
    // Additional game-specific properties
    ...(scenario.moduleRule && {
      gamePlatform: scenario.moduleRule, // e.g., "COC7", "DND5E"
    }),
    ...(scenario.playerNumber && {
      numberOfPlayers: {
        "@type": "QuantitativeValue",
        minValue: scenario.playerNumber[0],
        maxValue: scenario.playerNumber[1],
      },
    }),
  };

  return (
    <>
      {/* JSON-LD for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ScenarioDetailHeader title={scenario.title} />
      <ScenarioDetail lng={lng} scenario={scenario} />
    </>
  );
};

export default ScenarioDetailPage;
