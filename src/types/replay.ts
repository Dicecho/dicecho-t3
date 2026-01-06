import type { PaginatedResponse } from "@dicecho/types";

export interface IReplayOwner {
  mid: number;
  name: string;
  face: string;
}

export interface IReplayPage {
  page: number;
  part: string;
  duration: number;
}

export interface IReplayRelatedMod {
  _id: string;
  title: string;
  coverUrl: string;
  description: string;
  rateAvg: number;
  rateCount: number;
}

export interface IReplayDto {
  bvid: string;
  videos: number;
  coverUrl: string;
  title: string;
  description: string;
  duration: number;
  owner: IReplayOwner;
  pages: IReplayPage[];
  mod?: IReplayRelatedMod;
}

export interface ReplayListQuery {
  page?: number;
  pageSize?: number;
  filter?: {
    isRecommend?: boolean;
  };
  sort?: Record<string, number>;
}

export type ReplayListResponse = PaginatedResponse<IReplayDto>;
