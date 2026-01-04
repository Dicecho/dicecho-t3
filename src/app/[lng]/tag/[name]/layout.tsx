import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDicechoServerApi } from "@/server/dicecho";
import { TagDetailHeader as TagDetailHeaderCard, TagRelatedTags, TagTabs } from "@/components/Tag";
import { Card, CardContent } from "@/components/ui/card";
import { MobileFooter } from "@/components/Footer";
import { TagDetailHeader } from "./header";

// ISR with 5 minutes revalidation
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const api = await getDicechoServerApi();
  const tag = await api.tag.detail(decodedName, { revalidate: 300 }).catch(() => null);

  if (!tag) {
    return {
      title: "Tag - Dicecho",
      description: "TRPG tag on Dicecho",
    };
  }

  const title = `${tag.name} | Dicecho`;
  const description = tag.description || `Explore ${tag.modCount} scenarios tagged with ${tag.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: tag.coverUrl ? [{ url: tag.coverUrl }] : [],
      type: "website",
      siteName: "Dicecho",
    },
  };
}

export default async function TagDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string; name: string }>;
}) {
  const { lng, name } = await params;
  const decodedName = decodeURIComponent(name);

  const api = await getDicechoServerApi();
  const tag = await api.tag.detail(decodedName, { revalidate: 300 }).catch(() => null);

  if (!tag) {
    notFound();
  }

  return (
    <>
      <TagDetailHeader title={tag.name} />
      <div className="container py-6 pt-16 md:pt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="space-y-4">
            <TagDetailHeaderCard tag={tag} />

            <Card>
              <CardContent className="p-0">
                <TagTabs
                  tagName={tag.name}
                  lng={lng}
                  modCount={tag.modCount}
                  topicCount={tag.topicCount}
                />
                <div className="p-4">
                  {children}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <TagRelatedTags
                parents={tag.parents}
                children={tag.children}
                lng={lng}
              />
            </div>
          </div>
        </div>
      </div>
      <MobileFooter />
    </>
  );
}
