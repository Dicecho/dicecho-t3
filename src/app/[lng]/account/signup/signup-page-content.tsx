"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/Auth/SignupForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { trackSignUp } from "@/lib/analytics";
import DicechoLogo from "../dicecho.svg";
import Link from "next/link";
import { useDicecho } from "@/hooks/useDicecho";

export function SignupPageContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { api } = useDicecho();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      toast.info(t("already_signed_in"));
      router.replace(`/${i18n.language}/account/${session.user.id}`);
    }
  }, [status, session, router, i18n.language, t]);

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data: { email: string }) => {
      await api.auth.signup({ email: data.email });
    },
    onSuccess: () => {
      trackSignUp("email");
      toast.success(t("signup_email_sent"), {
        description: t("signup_check_inbox"),
      });
    },
    onError: (error) => {
      toast.error(t("sign_up_failed"), {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 mt-24 w-full max-w-sm px-4">
      <DicechoLogo className="text-primary" width={100} height={100} />

      <SignupForm onSubmit={signUpMutation}>
        <Button
          className="w-full"
          type="submit"
          color="primary"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("sign_up")}
        </Button>
      </SignupForm>

      <p className="text-sm text-muted-foreground">
        {t("already_have_account")}{" "}
        <Link
          href={`/${i18n.language}/account/signin`}
          className="text-primary underline hover:no-underline"
        >
          {t("sign_in")}
        </Link>
      </p>
    </div>
  );
}
