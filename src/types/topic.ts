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

export interface TopicListQuery {
  keyword?: string;
  pageSize?: number;
  page?: number;
}

