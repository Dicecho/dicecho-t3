import type { ISimpleUserDto, SortOrder } from '@dicecho/types';

export interface CommentDto {
  _id: string;
  targetId: string;
  targetName: string;
  content: string;
  createdAt: string;
  likeCount: number;
  repliesCount: number;
  isLiked: boolean;
  canEdit: boolean;
  user: ISimpleUserDto;
}

export interface ReplyDto extends CommentDto {
  parentId: string;
  replyTo?: CommentDto;
}

export interface ParentCommentDto extends CommentDto {
  replies?: Array<ReplyDto>;
}

export enum CommentSortKey {
  LikeCount = 'likeCount',
  CreatedAt = 'createdAt',
}

export type CommentQuery = {
  pageSize?: number;
  page?: number;
  sort?: Partial<Record<CommentSortKey, SortOrder>>;
};

export type CommentRepliesQuery = Pick<CommentQuery, 'pageSize' | 'page'>;

