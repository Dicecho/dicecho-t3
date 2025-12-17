import Link from "next/link";
import { getDicechoServerApi } from "@/server/dicecho";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionCard } from "./CollectionCard";
import { CollectionCardCarousel } from "./CollectionCardCarousel";
import { getTranslation } from "@/lib/i18n";

interface CollectionsServerProps {
  lng: string;
}

export async function CollectionsServer({ lng }: CollectionsServerProps) {
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();
  const collectionsData = await api.collection
    .list({
      pageSize: 6,
      filter: { isRecommend: true },
      sort: { createdAt: -1 },
    }, { revalidate: 300 })
    .catch(() => ({ data: [] }));

  const collections = collectionsData.data || [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("home_recommended_collections")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-10">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export async function MobileCollectionsServer({ lng }: CollectionsServerProps) {
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();
  const collectionsData = await api.collection
    .list({
      pageSize: 6,
      filter: { isRecommend: true },
      sort: { createdAt: -1 },
    }, { revalidate: 300 })
    .catch(() => ({ data: [] }));

  const collections = collectionsData.data || [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-3 px-4">{t("home_recommended_collections")}</h2>
      <CollectionCardCarousel collections={collections} />
    </div>
  );
}
