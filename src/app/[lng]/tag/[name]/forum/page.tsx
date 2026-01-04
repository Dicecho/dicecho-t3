import { Empty } from "@/components/Empty";
import { getTranslation } from "@/lib/i18n";

export default async function TagForumPage({
  params,
}: {
  params: Promise<{ lng: string; name: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return (
    <Empty>
      <div className="text-muted-foreground text-center">
        <p className="text-lg font-medium">{t("coming_soon")}</p>
        <p className="mt-2 text-sm">
          {t("forum_feature_coming_soon")}
        </p>
      </div>
    </Empty>
  );
}
