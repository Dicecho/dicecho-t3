import { WorkingAnimation } from "@/components/animation/working";
import { GlitchText } from "@/components/animation/glitch-text";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { HeaderSearch } from "@/components/Header/HeaderSearch";
import { NotificationReminder } from "@/components/Header/notification-reminder";
import { MobileFooter } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader left={<HeaderMenu />} right={<NotificationReminder />}>
        <HeaderSearch />
      </MobileHeader>
      <div className="flex flex-1 flex-col items-center justify-center max-w-160 mx-auto">
        <WorkingAnimation />
        <GlitchText className="text-4xl">Page Not Found</GlitchText>
      </div>
      <MobileFooter />
    </div>
  );
}
