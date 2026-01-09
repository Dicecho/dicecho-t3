"use client";
import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Upload, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface HomepageActionsProps {
  lng: string;
}

export const HomepageActions: FC<HomepageActionsProps> = ({ lng }) => {
  return (
    <div className="flex flex-col gap-2">
      <Link href={`/${lng}/module/submission`}>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          模组投稿
        </Button>
      </Link>

      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => signOut()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        登出
      </Button>
    </div>
  );
};

