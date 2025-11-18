"use client";

import { UserAvatar } from "@/components/User/Avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { useAccount } from "@/hooks/useAccount";
import { useDicecho } from "@/hooks/useDicecho";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { UserPlus, UserMinus, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AccountHeaderProps {
  user: IUserDto;
  lng: string;
}

export const AccountHeader = ({ user, lng }: AccountHeaderProps) => {
  const { t } = useTranslation();
  const { account, isAuthenticated } = useAccount();
  const { api } = useDicecho();
  const queryClient = useQueryClient();

  const isSelf = isAuthenticated && account._id === user._id;

  const followMutation = useMutation({
    mutationFn: () => api.user.follow(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", user._id] });
      toast({
        title: t("follow_success"),
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => api.user.unfollow(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", user._id] });
      toast({
        title: t("unfollow_success"),
      });
    },
  });

  return (
    <div className="relative min-h-[400px] flex flex-col items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.backgroundUrl || ""})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-[120px] h-[120px]">
          <UserAvatar
            user={user}
            alt={user.nickName}
            width={120}
            height={120}
            className="rounded-full shadow-lg object-cover w-[120px] h-[120px]"
          />
        </div>
        <div className="text-2xl font-bold">{user.nickName}</div>
        {user.note && (
          <div className="text-muted-foreground text-center max-w-md">
            {user.note}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6">
          <LinkWithLng href={`/${lng}/account/${user._id}/followers`}>
            <div className="flex flex-col items-center cursor-pointer hover:text-primary transition-colors">
              <span className="text-lg font-bold">{user.followerCount}</span>
              <span className="text-sm text-muted-foreground">{t("followers")}</span>
            </div>
          </LinkWithLng>
          <LinkWithLng href={`/${lng}/account/${user._id}/followings`}>
            <div className="flex flex-col items-center cursor-pointer hover:text-primary transition-colors">
              <span className="text-lg font-bold">{user.followingCount}</span>
              <span className="text-sm text-muted-foreground">{t("following")}</span>
            </div>
          </LinkWithLng>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{user.likedCount}</span>
            <span className="text-sm text-muted-foreground">{t("liked")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isSelf ? (
            <LinkWithLng href={`/${lng}/account/${user._id}/setting`}>
              <Button variant="outline">
                <Settings size={16} />
                {t("edit_profile")}
              </Button>
            </LinkWithLng>
          ) : (
            <>
              {user.isFollowed ? (
                <Button
                  variant="outline"
                  onClick={() => unfollowMutation.mutate()}
                  disabled={unfollowMutation.isPending}
                >
                  <UserMinus size={16} />
                  {t("unfollow")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                >
                  <UserPlus size={16} />
                  {t("follow")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

