"use client";

import { signIn } from "next-auth/react";
import { SigninForm } from "@/components/Auth/SigninForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import DicechoLogo from "./dicecho.svg";

export function SignIn() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

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
    <div className="flex flex-col items-center gap-8 mt-24">
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
    </div>
  );
}
