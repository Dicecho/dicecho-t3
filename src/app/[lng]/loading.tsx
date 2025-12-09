import { LoadingAnimation } from "@/components/Loading";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { HeaderSearch } from "@/components/Header/HeaderSearch";
import { MobileFooter } from "@/components/Footer";

export default function Loading() {
  return (
    <>
      <MobileHeader left={<HeaderMenu />}>
        <HeaderSearch />
      </MobileHeader>

      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingAnimation />
      </div>
      <MobileFooter />
    </>
  );
}
