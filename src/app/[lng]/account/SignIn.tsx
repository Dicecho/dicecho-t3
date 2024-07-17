"use client";

import { signIn } from "next-auth/react";
import { SigninForm } from "@/components/Auth/SigninForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";

export function SignIn() {
  const { t } = useTranslation();
  return (
    <SigninForm onSubmit={(d) => signIn("credentials", d)}>
      <Button className="w-full" type="submit" color="primary">
        {t("sign_in")}
      </Button>
    </SigninForm>
  );
}
