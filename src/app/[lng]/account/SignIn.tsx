"use client";

import { signIn } from "next-auth/react";
import { SigninForm } from "@/components/Auth/SigninForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignIn() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSignIn = async (data: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(t("sign_in_failed"), {
        description: result.error,
      });
    } else if (result?.ok) {
      // 登录成功，跳转或刷新
      router.refresh();
    }
  };

  return (
    <SigninForm onSubmit={handleSignIn}>
      <Button className="w-full" type="submit" color="primary">
        {t("sign_in")}
      </Button>
    </SigninForm>
  );
}
