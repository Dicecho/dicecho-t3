"use client";
import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn } from "next-auth/react"
import { SigninForm } from './SigninForm';

import type { FC } from "react";
import { Button } from "../ui/button";
// import { useAccount } from "@/hooks/useAccount";

interface AuthDialogProps extends DialogProps {}

export const AuthDialog: FC<AuthDialogProps> = ({ children, ...props }) => {
  // const { signByLocal } = useAccount();
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}

          <Tabs defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SigninForm onSubmit={(d) => signIn('credentials', d)}>
                <Button className="w-full" type="submit" color='primary'>
                  登录
                </Button>
              </SigninForm>
            </TabsContent>
            <TabsContent value="signup">
              Change your password here.
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
