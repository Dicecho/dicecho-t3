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

export const AuthDialog: FC<DialogProps> = ({ children, ...props }) => {
  const { t } = useTranslation();

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
              <SigninForm onSubmit={(d) => signIn("credentials", d)}>
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
