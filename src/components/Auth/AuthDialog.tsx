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
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const AuthDialog: FC<DialogProps> = ({ children, ...props }) => {
  const { t } = useTranslation();

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
    },
    onError: (error) => {
      toast.error(t("sign_in_failed"), {
        description: error.message,
      });
    },
  });

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("sign_in_to_dicecho")}</DialogTitle>

          <Tabs defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin" className="capitalize">
                {t("sign_in")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="capitalize">
                {t("sign_up")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SigninForm onSubmit={signInMutation}>
                <Button
                  disabled={isPending}
                  className="w-full"
                  type="submit"
                  color="primary"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
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
