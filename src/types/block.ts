import type { IModDto, IUserDto, IRateDto, SortOrder, PaginatedResponse } from "@dicecho/types";

export enum BlockTargetName {
  Mod = "Mod",
  User = "User",
  Rate = "Rate",
}

export enum BlockSortKey {
  CREATED_AT = "createdAt",
}

export interface BlockFilter {
  targetName?: BlockTargetName;
}

export interface BlockQuery {
  pageSize?: number;
  page?: number;
  sort?: Partial<Record<BlockSortKey, SortOrder>>;
  filter?: Partial<BlockFilter>;
}

interface BaseBlock {
  _id: string;
  targetName: BlockTargetName;
}

interface ModBlock extends BaseBlock {
  targetName: BlockTargetName.Mod;
  target: IModDto;
}

interface RateBlock extends BaseBlock {
  targetName: BlockTargetName.Rate;
  target: IRateDto;
}

interface UserBlock extends BaseBlock {
  targetName: BlockTargetName.User;
  target: Pick<IUserDto, "_id" | "nickName" | "avatarUrl">;
}

export type IBlockDto = ModBlock | RateBlock | UserBlock;

export type BlockListResponse = PaginatedResponse<IBlockDto>;

export interface IPendantDto {
  _id: string;
  name: string;
  url: string;
}
