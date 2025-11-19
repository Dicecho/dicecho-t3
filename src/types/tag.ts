export interface ITag {
  _id: string;
  name: string;
  coverUrl: string;
  description: string;
  modCount: number;
  topicCount: number;
  parents: Array<string>;
  children: Array<string>;
  alias: Array<string>;
}

export interface UpdateTagDto {
  coverUrl: string;
  description: string;
  children: Array<string>;
}

export interface TagQuery {
  keyword: string;
  pageSize?: number;
  page?: number;
}

