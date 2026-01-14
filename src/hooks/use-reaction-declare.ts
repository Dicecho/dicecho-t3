"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";

export type Attitude = "like" | "dislike" | "happy";

export interface ReactionState {
  declareCounts: Record<string, number>;
  declareStatus: Record<string, boolean>;
}

// like <-> dislike are mutually exclusive, happy is independent
const MUTUAL_EXCLUSIVE: Partial<Record<Attitude, Attitude>> = {
  like: "dislike",
  dislike: "like",
};

export function useReactionDeclare({
  targetName,
  targetId,
  initialState,
}: {
  targetName: string;
  targetId: string;
  initialState: ReactionState;
}) {
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const queryKey = ["reaction", targetName, targetId] as const;

  const { data: state = initialState } = useQuery({
    queryKey,
    queryFn: () => initialState,
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async ({ attitude, isActive }: { attitude: Attitude; isActive: boolean }) => {
      return isActive
        ? api.like.cancelDeclare(targetName, targetId, attitude)
        : api.like.declare(targetName, targetId, attitude);
    },
    onMutate: async ({ attitude, isActive }) => {
      await queryClient.cancelQueries({ queryKey });
      const currentState = queryClient.getQueryData<ReactionState>(queryKey);

      // Only snapshot attitudes that will be affected by this mutation
      const exclusive = MUTUAL_EXCLUSIVE[attitude];
      const affectedAttitudes: Attitude[] = exclusive ? [attitude, exclusive] : [attitude];
      const snapshot = {
        counts: Object.fromEntries(
          affectedAttitudes.map((a) => [a, currentState?.declareCounts[a] ?? 0]),
        ) as Record<string, number>,
        status: Object.fromEntries(
          affectedAttitudes.map((a) => [a, currentState?.declareStatus[a] ?? false]),
        ) as Record<string, boolean>,
      };

      queryClient.setQueryData<ReactionState>(queryKey, (prev) => {
        if (!prev) return prev;

        const newStatus = { ...prev.declareStatus, [attitude]: !isActive };
        const newCounts = {
          ...prev.declareCounts,
          [attitude]: (prev.declareCounts[attitude] ?? 0) + (isActive ? -1 : 1),
        };

        // Handle mutual exclusion: if activating current attitude, cancel the exclusive one
        if (!isActive && exclusive && prev.declareStatus[exclusive]) {
          newStatus[exclusive] = false;
          newCounts[exclusive] = Math.max(0, (prev.declareCounts[exclusive] ?? 0) - 1);
        }

        return { declareCounts: newCounts, declareStatus: newStatus };
      });

      return { snapshot, affectedAttitudes };
    },
    onError: (_error, _variables, context) => {
      // Only rollback the affected attitudes, not the entire state
      if (context?.snapshot && context?.affectedAttitudes) {
        queryClient.setQueryData<ReactionState>(queryKey, (prev) => {
          if (!prev) return prev;
          const newCounts = { ...prev.declareCounts };
          const newStatus = { ...prev.declareStatus };
          for (const a of context.affectedAttitudes) {
            newCounts[a] = context.snapshot.counts[a] ?? 0;
            newStatus[a] = context.snapshot.status[a] ?? false;
          }
          return { declareCounts: newCounts, declareStatus: newStatus };
        });
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData<ReactionState>(queryKey, {
        declareCounts: response.declareCounts,
        declareStatus: response.declareStatus,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const toggle = useCallback(
    (attitude: Attitude) => {
      mutation.mutate({ attitude, isActive: state.declareStatus?.[attitude] ?? false });
    },
    [mutation, state.declareStatus],
  );

  return {
    state,
    toggle,
    isPending: mutation.isPending,
    isActive: (attitude: Attitude) => state.declareStatus?.[attitude] ?? false,
    getCount: (attitude: Attitude) => state.declareCounts?.[attitude] ?? 0,
  };
}
