"use client";

import { UserAvatar } from "@/components/User/Avatar";
import { Button } from "@/components/ui/button";
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

  const stats = [
    {
      label: t("followers"),
      value: user.followerCount,
      href: `/${lng}/account/${user._id}/followers`,
    },
    {
      label: t("following"),
      value: user.followingCount,
      href: `/${lng}/account/${user._id}/followings`,
    },
    {
      label: t("liked"),
      value: user.likedCount,
    },
  ];

  return (
    <section className="relative isolate w-full overflow-hidden">
      <div className="absolute inset-0 h-[240px] bg-muted md:h-[380px]">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${user.backgroundUrl || ""})` }}
        >
          <div className="h-full w-full bg-linear-to-b from-black/20 via-black/40 to-background" />
        </div>
      </div>
      <div className="relative container mx-auto flex flex-col gap-6 pb-10 pt-16 md:pt-28">
        <div className="flex md:flex-col md:items-center gap-4 md:text-center flex-row items-end md:gap-8 text-left">
          <div className="relative h-32 w-32 rounded-full border-4 border-background/70 bg-background shadow-2xl">
            <UserAvatar
              user={user}
              className="h-full w-full"
            />
          </div>
          <div>
            <div className="text-2xl font-light tracking-tight text-white md:text-4xl">
              {user.nickName}
            </div>
            {user.note && (
              <p className="mt-2 text-base text-white/80 md:max-w-2xl">{user.note}</p>
            )}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-background/90 p-5 text-foreground shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="grid w-full gap-4 text-center text-xs uppercase tracking-wide text-muted-foreground sm:grid-cols-3">
              {stats.map((stat) => {
                const content = (
                  <div className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl border border-transparent py-2 transition-colors hover:border-primary/60">
                    <span className="text-2xl font-semibold text-foreground">
                      {stat.value}
                    </span>
                    <span>{stat.label}</span>
                  </div>
                );

                return stat.href ? (
                  <LinkWithLng key={stat.label} href={stat.href}>
                    {content}
                  </LinkWithLng>
                ) : (
                  <div key={stat.label}>{content}</div>
                );
              })}
            </div>

            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-end">
              {isSelf ? (
                <LinkWithLng href={`/${lng}/account/${user._id}/setting`}>
                  <Button variant="outline" size="sm" className="min-w-[140px]">
                    <Settings size={16} />
                    {t("edit_profile")}
                  </Button>
                </LinkWithLng>
              ) : user.isFollowed ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-[140px]"
                  onClick={() => unfollowMutation.mutate()}
                  disabled={unfollowMutation.isPending}
                >
                  <UserMinus size={16} />
                  {t("unfollow")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="min-w-[140px]"
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                >
                  <UserPlus size={16} />
                  {t("follow")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

