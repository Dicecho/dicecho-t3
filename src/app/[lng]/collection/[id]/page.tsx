import { getDicechoServerApi } from "@/server/dicecho";
import { CollectionDetail } from "@/components/Collection";
import { MobileFooter } from "@/components/Footer";
import { notFound, redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";

export default async function CollectionDetailPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const api = await getDicechoServerApi({ withToken: true });

  const session = await getServerAuthSession();

  try {
    const collection = await api.collection.detail(id);

    // Check permissions: private collections can only be viewed by the creator
    if (collection.accessLevel === "private") {
      if (!session || session.user._id !== collection.user._id) {
        redirect(`/${lng}`);
      }
    }

    return (
      <>
        <div className="container py-6">
          <CollectionDetail collection={collection} />
        </div>
        <MobileFooter />
      </>
    );
  } catch (error) {
    notFound();
  }
}
