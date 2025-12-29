"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useDicecho } from "@/hooks/useDicecho";

export type Attitude = "like" | "dislike" | "happy";

export interface ReactionState {
  declareCounts: Record<string, number>;
  declareStatus: Record<string, boolean>;
}

export interface UseReactionDeclareOptions {
  targetName: string;
  targetId: string;
  initialState: ReactionState;
}

export interface UseReactionDeclareReturn {
  state: ReactionState;
  toggle: (attitude: Attitude) => void;
  isPending: boolean;
  isActive: (attitude: Attitude) => boolean;
  getCount: (attitude: Attitude) => number;
}

export function useReactionDeclare({
  targetName,
  targetId,
  initialState,
}: UseReactionDeclareOptions): UseReactionDeclareReturn {
  const { api } = useDicecho();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ReactionState>(initialState);
  
  // Track previous targetId to sync state when target changes or declareStatus has meaningful updates
  const prevTargetIdRef = useRef(targetId);
  const prevStatusRef = useRef(initialState.declareStatus);

  useEffect(() => {
    // Check for meaningful changes
    const statusChanged = 
      prevStatusRef.current.like !== initialState.declareStatus?.like ||
      prevStatusRef.current.dislike !== initialState.declareStatus?.dislike ||
      prevStatusRef.current.happy !== initialState.declareStatus?.happy;
    
    const targetChanged = prevTargetIdRef.current !== targetId;

    if (statusChanged || targetChanged) {
      setState(initialState);
      prevTargetIdRef.current = targetId;
      prevStatusRef.current = initialState.declareStatus;
    }
  }, [targetId, initialState]);

  const isActive = useCallback(
    (attitude: Attitude) => state.declareStatus?.[attitude] ?? false,
    [state.declareStatus]
  );

  const getCount = useCallback(
    (attitude: Attitude) => state.declareCounts?.[attitude] ?? 0,
    [state.declareCounts]
  );

  const toggle = useCallback(
    (attitude: Attitude) => {
      const isCurrentlyActive = isActive(attitude);
      const currentCount = getCount(attitude);

      // like and dislike are mutually exclusive
      const mutualExclusive: Attitude | null =
        attitude === "like" ? "dislike" : attitude === "dislike" ? "like" : null;
      const exclusiveActive = mutualExclusive ? isActive(mutualExclusive) : false;
      const exclusiveCount = mutualExclusive ? getCount(mutualExclusive) : 0;

      // Optimistic update
      setState((prev) => {
        const newStatus = { ...prev.declareStatus, [attitude]: !isCurrentlyActive };
        const newCounts = {
          ...prev.declareCounts,
          [attitude]: isCurrentlyActive ? currentCount - 1 : currentCount + 1,
        };

        // Cancel the mutually exclusive reaction if activating one
        if (!isCurrentlyActive && mutualExclusive && exclusiveActive) {
          newStatus[mutualExclusive] = false;
          newCounts[mutualExclusive] = Math.max(0, exclusiveCount - 1);
        }

        return { declareCounts: newCounts, declareStatus: newStatus };
      });

      startTransition(async () => {
        try {
          const response = isCurrentlyActive
            ? await api.like.cancelDeclare(targetName, targetId, attitude)
            : await api.like.declare(targetName, targetId, attitude);

          // Update with server response
          setState({
            declareCounts: response.declareCounts,
            declareStatus: response.declareStatus,
          });
        } catch {
          // Revert on error - restore both the toggled attitude and any exclusive one
          setState((prev) => {
            const revertedStatus = { ...prev.declareStatus, [attitude]: isCurrentlyActive };
            const revertedCounts = { ...prev.declareCounts, [attitude]: currentCount };

            // Restore the mutually exclusive reaction if it was cancelled
            if (!isCurrentlyActive && mutualExclusive && exclusiveActive) {
              revertedStatus[mutualExclusive] = true;
              revertedCounts[mutualExclusive] = exclusiveCount;
            }

            return { declareCounts: revertedCounts, declareStatus: revertedStatus };
          });
        }
      });
    },
    [api.like, targetName, targetId, isActive, getCount]
  );

  return {
    state,
    toggle,
    isPending,
    isActive,
    getCount,
  };
}
