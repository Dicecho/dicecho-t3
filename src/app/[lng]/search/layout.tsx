import { Skeleton } from "@/components/ui/skeleton";
import { SearchLayout } from "./search-layout";
import { PropsWithChildren, Suspense } from "react";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { HeaderSearch } from "@/components/Header/HeaderSearch";
import { MobileFooter } from "@/components/Footer";

export default function layout({ children }: PropsWithChildren) {
  return (
    <>
      <MobileHeader left={<HeaderMenu />}>
        <HeaderSearch />
      </MobileHeader>

      <Suspense
        fallback={
          <div className="container py-8">
            <div className="mb-4">
              <Skeleton className="mb-4 h-8 w-64 rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          </div>
        }
      >
        <SearchLayout>{children}</SearchLayout>
      </Suspense>
      <MobileFooter />
    </>
  );
}
