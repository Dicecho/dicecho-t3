"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { SigninForm } from "@/components/Auth/SigninForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { trackSignIn } from "@/lib/analytics";
import DicechoLogo from "../dicecho.svg";
import Link from "next/link";

export function SigninPageContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      toast.info(t("already_signed_in"));
      router.replace(`/${i18n.language}/account/${session.user.id}`);
    }
  }, [status, session, router, i18n.language, t]);

  const { mutate: signInMutation, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        throw new Error(result?.error ?? t("sign_in_failed"));
      }

      return result;
    },
    onSuccess: () => {
      trackSignIn("credentials");
      toast.success(t("sign_in_success"));
      router.push(`/${i18n.language}/`);
    },
    onError: (error) => {
      toast.error(t("sign_in_failed"), {
        description: error.message,
      });
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 mt-24 w-full max-w-sm px-4">
      <DicechoLogo className="text-primary" width={100} height={100} />

      <SigninForm onSubmit={signInMutation}>
        <Button
          className="w-full"
          type="submit"
          color="primary"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("sign_in")}
        </Button>
      </SigninForm>

      <p className="text-sm text-muted-foreground">
        {t("no_account_yet")}{" "}
        <Link
          href={`/${i18n.language}/account/signup`}
          className="text-primary underline hover:no-underline"
        >
          {t("sign_up")}
        </Link>
      </p>
    </div>
  );
}
