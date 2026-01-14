"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useDicecho } from "./useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  RateType,
  RemarkContentType,
  AccessLevel,
  type IRateDto,
} from "@dicecho/types";

export function useScenarioRate(modId: string) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  // Consistent queryKey
  const queryKey = ["rate", "my", modId, userId] as const;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return null;

      const res = await api.rate.list({
        userId,
        modId,
      });

      return res.data[0] ?? null;
    },
    enabled: !!userId && !!modId,
  });

  const markMutation = useMutation({
    mutationFn: async () => {
      return api.rate.create(modId, {
        type: RateType.Mark,
        remarkType: RemarkContentType.Markdown,
        accessLevel: AccessLevel.Public,
        remark: "",
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousRate = queryClient.getQueryData<IRateDto | null>(queryKey);
      queryClient.setQueryData<IRateDto | null>(queryKey, {
        _id: "optimistic",
        type: RateType.Mark,
        modId,
      } as unknown as IRateDto);
      return { previousRate };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousRate !== undefined) {
        queryClient.setQueryData(queryKey, context.previousRate);
      }
      toast.error(t("error"));
    },
    onSuccess: () => {
      toast.success(t("marked_as_want_to_play"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["rate"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!query.data) {
        throw new Error("No rate to delete");
      }
      return api.rate.delete(query.data._id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousRate = queryClient.getQueryData<IRateDto | null>(queryKey);
      queryClient.setQueryData<IRateDto | null>(queryKey, null);
      return { previousRate };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousRate !== undefined) {
        queryClient.setQueryData(queryKey, context.previousRate);
      }
      toast.error(t("error"));
    },
    onSuccess: () => {
      toast.success(t("rate_deleted"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["rate"] });
    },
  });

  const myRate = query.data;
  const isRated = myRate?.type === RateType.Rate;
  const isMarked = myRate?.type === RateType.Mark;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    myRate,
    isLoading: query.isLoading,
    isRated,
    isMarked,
    mark: markMutation.mutate,
    isMarking: markMutation.isPending,
    deleteRate: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    invalidate,
  };
}
