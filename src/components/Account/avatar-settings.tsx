"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Pendant } from "./pendant";
import AvatarUpload from "@/components/ui/avatar-upload";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import type { IPendantDto } from "@/types/block";
import { toast } from "sonner";

type AvatarSettingsProps = {
  user: IUserDto;
};

type PendantItemProps = {
  pendant: IPendantDto;
  previewAvatar: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  isPending: boolean;
};

function PendantItem({
  pendant,
  previewAvatar,
  isActive,
  onActivate,
  onDeactivate,
  isPending,
}: PendantItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
      <Pendant url={pendant.url} className="mb-4 mt-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={previewAvatar} className="object-cover" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Pendant>
      <div className="font-medium text-sm mb-3">{pendant.name}</div>
      {isActive ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onDeactivate}
          disabled={isPending}
        >
          {isPending ? t("processing") : t("pendant_deactivate")}
        </Button>
      ) : (
        <Button
          size="sm"
          className="w-full"
          onClick={onActivate}
          disabled={isPending}
        >
          {isPending ? t("processing") : t("pendant_activate")}
        </Button>
      )}
    </div>
  );
}

export function AvatarSettings({ user: initialUser }: AvatarSettingsProps) {
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Use local state for immediate preview updates
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl);
  const [pendantUrl, setPendantUrl] = useState<string | undefined>(initialUser.pendantUrl);

  const { data: pendants, isLoading: pendantsLoading } = useQuery({
    queryKey: ["pendants", "self"],
    queryFn: () => api.pendant.self(),
  });

  const activateMutation = useMutation({
    mutationFn: (pendantId: string) => api.pendant.active(pendantId),
    onMutate: (pendantId) => {
      // Optimistic update
      const pendant = pendants?.find((p) => p._id === pendantId);
      if (pendant) {
        setPendantUrl(pendant.url);
      }
    },
    onSuccess: () => {
      toast.success(t("pendant_activated"));
      queryClient.invalidateQueries({ queryKey: ["user", "profile", initialUser._id] });
    },
    onError: () => {
      // Revert on error
      setPendantUrl(initialUser.pendantUrl);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => api.pendant.inactive(),
    onMutate: () => {
      // Optimistic update
      setPendantUrl(undefined);
    },
    onSuccess: () => {
      toast.success(t("pendant_deactivated"));
      queryClient.invalidateQueries({ queryKey: ["user", "profile", initialUser._id] });
    },
    onError: () => {
      // Revert on error
      setPendantUrl(initialUser.pendantUrl);
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (newAvatarUrl: string) => api.user.updateProfile({ avatarUrl: newAvatarUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", initialUser._id] });
    },
  });

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
    updateAvatarMutation.mutate(url);
  };

  const activeId = pendants?.find((pendant) => pendant.url === pendantUrl)?._id;

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings_avatar_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center pb-10">
            <Pendant url={pendantUrl}>
              <AvatarUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                size={96}
              />
            </Pendant>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings_pendant_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {pendantsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : pendants && pendants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pendants.map((pendant) => (
                <PendantItem
                  key={pendant._id}
                  pendant={pendant}
                  previewAvatar={avatarUrl}
                  isActive={activeId === pendant._id}
                  onActivate={() => activateMutation.mutate(pendant._id)}
                  onDeactivate={() => deactivateMutation.mutate()}
                  isPending={
                    activateMutation.isPending || deactivateMutation.isPending
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("no_pendants")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
