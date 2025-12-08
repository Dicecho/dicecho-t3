import { getDicechoServerApi } from "@/server/dicecho";
import { ScenarioDetailClient } from "./ScenarioDetailClient";

interface ScenarioDetailServerProps {
  lng: string;
  id: string;
}

export async function ScenarioDetailServer({ lng, id }: ScenarioDetailServerProps) {
  const api = await getDicechoServerApi();

  // Server-side data fetching with 300s (5min) revalidation cache
  // Scenario details change less frequently than lists
  const scenario = await api.module.detail(id, { revalidate: 300 });

  // Generate JSON-LD structured data for Google rich snippets
  // Use VideoGame type (most appropriate for TRPG scenarios in schema.org)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: scenario.originTitle || scenario.title,
    description: scenario.description || `${scenario.title} - TRPG scenario`,
    image: scenario.coverUrl,
    ...(scenario.rateCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
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
        '@type': 'QuantitativeValue',
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

      <ScenarioDetailClient
        lng={lng}
        scenarioId={id}
        initialScenario={scenario}
      />
    </>
  );
}
