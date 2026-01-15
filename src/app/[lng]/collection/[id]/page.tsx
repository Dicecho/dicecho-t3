import { getDicechoServerApi } from "@/server/dicecho";
import { CollectionDetail } from "@/components/Collection";
import { MobileFooter } from "@/components/Footer";
import { CollectionDetailHeader } from "./header";
import { notFound, redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";

export default async function CollectionDetailPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const api = await getDicechoServerApi({ withToken: true });
  const collection = await api.collection.detail(id).catch(() => null);

  if (!collection) {
    return notFound();
  }
  // JSON-LD structured data for Google rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `https://dicecho.com/${lng}/collection/${id}`,
    url: `https://dicecho.com/${lng}/collection/${id}`,
    name: collection.name,
    ...(collection.description && {
      description: collection.description,
    }),
    numberOfItems: collection.items.length,
    ...(collection.user && {
      author: {
        "@type": "Person",
        name: collection.user.nickName,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionDetailHeader title={collection.name} collection={collection} />
      <div className="md:container md:py-6 max-md:pb-24">
        <CollectionDetail collection={collection} />
      </div>
    </>
  );
}
