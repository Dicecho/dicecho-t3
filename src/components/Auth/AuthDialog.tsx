"use client";
import {
  Dialog,
  DialogTitle,
  type DialogProps,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";

import type { FC } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import DicechoLogo from "./dicecho.svg";
import { useDicecho } from "@/hooks/useDicecho";

export const AuthDialog: FC<DialogProps> = ({ children, onOpenChange, ...props }) => {
  const { t } = useTranslation();
  const { api } = useDicecho();

  const { mutate: signInMutation, isPending: isSigningIn } = useMutation({
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
      onOpenChange?.(false);
    },
    onError: (error) => {
      toast.error(t("sign_in_failed"), {
        description: error.message,
      });
    },
  });

  const { mutate: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: { email: string }) => {
      await api.auth.signup({ email: data.email });
    },
    onSuccess: () => {
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
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-4" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="hidden">{t("sign_in_to_dicecho")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center w-full gap-8">
          <DicechoLogo className="text-primary" width={100} height={100} />

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="signin" className="flex-1 capitalize">
                {t("sign_in")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 capitalize">
                {t("sign_up")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SigninForm onSubmit={signInMutation}>
                <Button
                  disabled={isSigningIn}
                  className="w-full"
                  type="submit"
                  color="primary"
                >
                  {isSigningIn ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t("sign_in")}
                </Button>
              </SigninForm>
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSubmit={signUpMutation}>
                <Button
                  disabled={isSigningUp}
                  className="w-full"
                  type="submit"
                  color="primary"
                >
                  {isSigningUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t("sign_up")}
                </Button>
              </SignupForm>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
