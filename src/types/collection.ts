import type { PaginatedResponse, IModDto, SortOrder } from "@dicecho/types";

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

export enum CollectionSortKey {
  CREATED_AT = 'createdAt',
  FAVORITE_COUNT = 'favoriteCount',
}

export interface CollectionFilter {
  isRecommend: boolean;
}


export interface CollectionListQuery {
  readonly pageSize: number;
  readonly page: number;
  readonly sort?: Partial<Record<CollectionSortKey, SortOrder>>;
  readonly targetName?: string;
  targetId?: string;
  creatorId?: string;
  readonly filter?: Partial<CollectionFilter>;
}

export type CollectionListResponse = PaginatedResponse<CollectionDto>;

export type CollectionItemsResponse = Array<IModDto>;

