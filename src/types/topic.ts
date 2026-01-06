import { IUserDto } from "@dicecho/types";

export interface ISimpleUserDto {
  _id: string;
  nickName: string;
  avatarUrl: string;
}

export interface ITopicDto {
  _id: string;
  isLiked: boolean;
  disLiked: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  lastCommentedAt: Date;
  title: string;
  content: string;
  readCount: number;
  isHighlight: boolean;
  isSpoiler: boolean;
  canEdit: boolean;
  relatedMods: Array<{
    _id: string;
    title: string;
    coverUrl: string;
    description: string;
    rateAvg: number;
    rateCount: number;
  }>;
  domain: {
    _id: string;
    title: string;
    coverUrl: string;
  };
  author: ISimpleUserDto;
}

export enum TopicSortKey {
  LIKE_COUNT = 'likeCount',
  COMMENT_COUNT = 'commentCount',
  CREATED_AT = 'createdAt',
}

export type TopicSort = Partial<Record<TopicSortKey, 1 | -1>>;

export const TOPIC_SORT_OPTIONS: Record<
  TopicSortKey,
  { labelKey: string; value: TopicSort }
> = {
  [TopicSortKey.CREATED_AT]: {
    labelKey: "topic_sort_latest",
    value: { [TopicSortKey.CREATED_AT]: -1 },
  },
  [TopicSortKey.COMMENT_COUNT]: {
    labelKey: "topic_sort_mostReply",
    value: { [TopicSortKey.COMMENT_COUNT]: -1 },
  },
  [TopicSortKey.LIKE_COUNT]: {
    labelKey: "topic_sort_mostLike",
    value: { [TopicSortKey.LIKE_COUNT]: -1 },
  },
};

export interface TopicListQuery {
  keyword?: string;
  pageSize?: number;
  page?: number;
  sort?: TopicSort;
  filter?: {
    author?: string;
  };
  modId?: string;
}

export interface CreateTopicDto {
  title: string;
  content: string;
  isSpoiler?: boolean;
  relatedModIds?: string[];
}

export interface UpdateTopicDto {
  title?: string;
  content?: string;
  isSpoiler?: boolean;
  relatedModIds?: string[];
}

