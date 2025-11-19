import type { PaginatedResponse, IModDto } from "@dicecho/types";

export type CollectionAccessLevel = "public" | "private";

export interface CollectionItem {
  targetName: string;
  targetId: string;
}

export interface CollectionDto {
  _id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  isDefault: boolean;
  accessLevel: CollectionAccessLevel;
  createdAt: string;
  user: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
  isFavorited: boolean;
  canEdit: boolean;
  favoriteCount: number;
  commentCount: number;
  items: Array<CollectionItem>;
}

export interface CollectionListQuery {
  pageSize?: number;
  page?: number;
  creatorId?: string;
  targetId?: string;
}

export type CollectionListResponse = PaginatedResponse<CollectionDto>;

export type CollectionItemsResponse = Array<IModDto>;

