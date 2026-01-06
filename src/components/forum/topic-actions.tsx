"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ITopicDto } from "@/types/topic";

interface TopicActionsProps {
  topic: ITopicDto;
  onUpdate?: (topic: ITopicDto) => void;
}

export function TopicActions({ topic, onUpdate }: TopicActionsProps) {
  const { api } = useDicecho();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(topic.isLiked);
  const [isDisliked, setIsDisliked] = useState(topic.disLiked);
  const [likeCount, setLikeCount] = useState(topic.likeCount);

  const likeMutation = useMutation({
    mutationFn: async (type: "like" | "dislike") => {
      const currentlyLiked = type === "like" ? isLiked : isDisliked;

      if (currentlyLiked) {
        await api.like.cancelDeclare("Topic", topic._id, type);
      } else {
        await api.like.declare("Topic", topic._id, type);
      }
      return { type, wasActive: currentlyLiked };
    },
    onMutate: async (type) => {
      // Optimistic update
      if (type === "like") {
        if (isLiked) {
          setIsLiked(false);
          setLikeCount((c) => c - 1);
        } else {
          setIsLiked(true);
          setLikeCount((c) => c + 1);
          if (isDisliked) {
            setIsDisliked(false);
          }
        }
      } else {
        if (isDisliked) {
          setIsDisliked(false);
        } else {
          setIsDisliked(true);
          if (isLiked) {
            setIsLiked(false);
            setLikeCount((c) => c - 1);
          }
        }
      }
    },
    onError: (_, type) => {
      // Revert on error
      if (type === "like") {
        setIsLiked(topic.isLiked);
        setLikeCount(topic.likeCount);
      } else {
        setIsDisliked(topic.disLiked);
      }
    },
  });

  const handleLike = () => {
    if (!session) return;
    likeMutation.mutate("like");
  };

  const handleDislike = () => {
    if (!session) return;
    likeMutation.mutate("dislike");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={!session || likeMutation.isPending}
        className={cn(isLiked && "text-primary")}
      >
        <ThumbsUp className={cn("mr-1 h-4 w-4", isLiked && "fill-current")} />
        {likeCount}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        disabled={!session || likeMutation.isPending}
        className={cn(isDisliked && "text-destructive")}
      >
        <ThumbsDown className={cn("h-4 w-4", isDisliked && "fill-current")} />
      </Button>
    </div>
  );
}
