"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { VerifyForm } from "@/components/Auth/VerifyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/react";

export function VerifyPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { api } = useDicecho();

  const email = searchParams.get("email");
  const verifyCode = searchParams.get("verifyCode");

  const {
    data: isValid,
    isLoading: isChecking,
    error: checkError,
  } = useQuery({
    queryKey: ["checkVerify", email, verifyCode],
    queryFn: async () => {
      if (!email || !verifyCode) {
        throw new Error(t("verify_link_invalid"));
      }
      await api.auth.checkVerify({ email, verifyCode });
      return true;
    },
    enabled: Boolean(email && verifyCode),
    retry: false,
  });

  const { mutate: verifyMutation, isPending: isVerifying } = useMutation({
    mutationFn: async (data: { nickName: string; password: string }) => {
      if (!email || !verifyCode) {
        throw new Error(t("verify_link_invalid"));
      }
      await api.auth.verify({
        email,
        verifyCode,
        nickName: data.nickName,
        password: data.password,
      });
    },
    onSuccess: () => {
      toast.success(t("account_activated"));
      router.push("/");
    },
    onError: (error) => {
      toast.error(t("verify_failed"), {
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });

  if (!email || !verifyCode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center min-h-[320px] p-6">
          <p className="text-muted-foreground">{t("verify_link_invalid")}</p>
        </CardContent>
      </Card>
    );
  }

  if (isChecking) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center min-h-[320px] p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (checkError || !isValid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center min-h-[320px] p-6">
          <p className="text-muted-foreground">
            {checkError instanceof Error
              ? checkError.message
              : t("verify_link_expired")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center min-h-[320px] p-6">
        <h2 className="text-lg font-medium mb-6">{t("activate_account")}</h2>
        <div className="w-full">
          <VerifyForm onSubmit={verifyMutation}>
            <Button
              disabled={isVerifying}
              className="w-full"
              type="submit"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("start_dicecho")}
            </Button>
          </VerifyForm>
        </div>
      </CardContent>
    </Card>
  );
}
