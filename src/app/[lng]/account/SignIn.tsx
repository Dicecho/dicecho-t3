"use client";

import { signIn } from "next-auth/react";
import { SigninForm } from "@/components/Auth/SigninForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { Copy } from "lucide-react";

export function SignIn() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const handleCopyError = async (errorText: string) => {
    try {
      await navigator.clipboard.writeText(errorText);
      toast({
        title: t("copied"),
        description: t("error_copied_to_clipboard"),
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSignIn = async (data: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      const errorText = `${t("sign_in_failed")}: ${result.error}`;
      toast({
        variant: "destructive",
        title: t("sign_in_failed"),
        description: result.error,
        action: (
          <ToastAction
            altText={t("copy_error")}
            onClick={() => handleCopyError(errorText)}
          >
            <Copy className="h-4 w-4" />
          </ToastAction>
        ),
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
