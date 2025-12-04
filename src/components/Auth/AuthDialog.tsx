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

import type { FC } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";

export const AuthDialog: FC<DialogProps> = ({ children, ...props }) => {
  const { t } = useTranslation();

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
      // 登录成功，关闭对话框
      if (props.onOpenChange) {
        props.onOpenChange(false);
      }
      // 刷新页面以更新 session
      window.location.reload();
    }
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("sign_in_to_dicecho")}</DialogTitle>

          <Tabs defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin" className="capitalize">{t("sign_in")}</TabsTrigger>
              <TabsTrigger value="signup" className="capitalize">{t("sign_up")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SigninForm onSubmit={handleSignIn}>
                <Button className="w-full" type="submit" color="primary">
                  {t("sign_in")}
                </Button>
              </SigninForm>
            </TabsContent>
            <TabsContent value="signup">working...</TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
