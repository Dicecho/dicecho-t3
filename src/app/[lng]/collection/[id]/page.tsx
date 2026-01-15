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
  const { id } = params;

  const api = await getDicechoServerApi({ withToken: true });
  const collection = await api.collection.detail(id).catch(() => null);

  if (!collection) {
    return notFound();
  }

  return (
    <>
      <CollectionDetailHeader title={collection.name} collection={collection} />
      <div className="md:container md:py-6 max-md:pb-24">
        <CollectionDetail collection={collection} />
      </div>
      <MobileFooter />
    </>
  );
}
