import { AuthErrorCode } from "@dicecho/types";
import type {
  ModListApiResponse,
  IModListQuery,
  ModRetrieveApiResponse,
  ILoginUserDto,
  ILocalApiResponse,
  IEmailRegisterUserDto,
  IRefreshApiResponse,
  PageableQuery,
  PaginatedResponse,
  IUserDto,
  Response,
  ModFilterConfig,
  IRateListQuery,
  IRateListApiResponse,
  IRateDto,
  Error as DicechoServerError,
  IModDto,
} from "@dicecho/types";
import {
  type APIClientOptions,
  type FetchLikeInit,
} from "./apiClient";
import * as qs from "qs";
import type {
  CollectionDto,
  CollectionItemsResponse,
  CollectionListQuery,
  CollectionListResponse,
} from "@/types/collection";
import type { CommentQuery, CommentRepliesQuery, ParentCommentDto, ReplyDto } from "@/types/comment";
import type { ITag, TagQuery } from "@/types/tag";
import type { ITopicDto, TopicListQuery } from "@/types/topic";
import type {
  INotificationDto,
  NotificationListQuery,
  NotificationPaginatedResponse,
} from "@/types/notification";

export function isBackendError(
  err: unknown,
): err is { body: DicechoServerError } {
  if (!err) {
    return false;
  }

  const body = (err as { body: DicechoServerError }).body;

  if (body === undefined) {
    return false;
  }

  return body.success !== undefined && body.code !== undefined;
}

type Empty = Record<string, never>;

export interface DeclareResponse {
  _id: string;
  declareCounts: Record<string, number>;
  declareStatus: Record<string, boolean>;
}

export type DicechoApiOptions = APIClientOptions & {
  auth?: DicechoAuthProvider;
};

export type DicechoAuthProvider = {
  getAccessToken: (options?: { minValidityMs?: number }) => Promise<string | undefined>;
  onAuthInvalid?: (reason: "refresh_failed" | "refresh_token_disabled") => void | Promise<void>;
};

type UpdateProfileDto = Partial<{
  nickName: string;
  avatarUrl: string;
  backgroundUrl: string;
  note: string;
  notice: string;
}>;

type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

type CreateCollectionDto = {
  name: string;
  description?: string;
};

type UpdateCollectionDto = Partial<
  Pick<CollectionDto, "name" | "description" | "coverUrl" | "accessLevel">
>;

type ModCreatePayload = {
  title: string;
  originTitle?: string;
  alias?: string;
  description?: string;
  coverUrl?: string;
  imageUrls?: string[];
  playerNumber: [number, number];
  moduleRule: string;
  tags?: string[];
  relatedLinks?: { name: string; url: string }[];
  languages?: string[];
};



type PublishModPayload = ModCreatePayload & {
  modFiles: {
    name: string;
    size: number;
    url: string;
    type: string;
  }[];
}

type ContributeModPayload = ModCreatePayload & {
  author: string;
};

type ModUpsertPayload = Partial<
  Pick<
    IModDto,
    | "title"
    | "originTitle"
    | "alias"
    | "description"
    | "origin"
    | "originUrl"
    | "coverUrl"
    | "moduleRule"
    | "playerNumber"
  >
> & {
  tags?: string[];
  languages?: string[];
  relatedLinks?: IModDto["relatedLinks"];
  imageUrls?: IModDto["imageUrls"];
  modFiles?: IModDto["modFiles"];
};

export interface OperationLogDto {
  _id: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  createdAt: string;
  action: string;
  changedKeys: string[];
  targetId: string;
  targetName: string;
  operator: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
}

export interface OSSCredentials {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
  Endpoint: string;
  Domain: string;
  Path: string;
  Secure: boolean;
  Bucket: string;
  Region: string;
  Cname?: string;
}

export interface BannerDto {
  priority: number;
  action: string;
  imageUrl: string;
  link: string;
  eventName?: string;
  giftCode?: string;
}

function createFetchLikeInit(
  method: FetchLikeInit["method"],
  params: object,
  headers: Record<string, string>,
  fetchOptions?: { revalidate?: number | false; tags?: string[] },
): FetchLikeInit & { next?: { revalidate?: number | false; tags?: string[] } } {
  const init: FetchLikeInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(method !== "GET" ? { cache: "no-cache" as RequestCache } : {}),
  };

  if (method === "GET" && fetchOptions) {
    init.next = fetchOptions;
  }

  if (Object.keys(params).length !== 0) {
    Object.assign(init, { body: JSON.stringify(params) });
  }

  return init;
}

async function requestJson<R extends object>(
  fetchImpl: (input: string, init?: FetchLikeInit) => Promise<{ status: number; json(): Promise<unknown> }>,
  url: string,
  init: FetchLikeInit,
): Promise<R> {
  const res = await fetchImpl(url, init);
  const body = res.status === 204 ? null : await res.json();

  if (res.status >= 200 && res.status < 400) {
    return body as R;
  }

  throw { body };
}

export function createDicechoApi(opts: DicechoApiOptions) {
  const fetchImpl: (input: string, init?: FetchLikeInit) => Promise<{ status: number; json(): Promise<unknown> }> =
    opts.fetch ?? ((...args) => fetch(...args));
  const auth = opts.auth;

  const request = async <P extends object, R extends object>(
    endpoint: string,
    method: FetchLikeInit["method"],
    params: P = {} as P,
    { withToken = true, revalidate, tags }: { withToken?: boolean; revalidate?: number | false; tags?: string[] } = {},
  ): Promise<R> => {
    const fetchOptions = revalidate !== undefined || tags ? { revalidate, tags } : undefined;

    const headers: Record<string, string> = {};
    if (withToken && auth) {
      const accessToken = await auth.getAccessToken({ minValidityMs: 30_000 });
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    try {
      const init = createFetchLikeInit(method, params, headers, fetchOptions);
      const res = await requestJson<Response<R>>(fetchImpl, `${opts.origin}${endpoint}`, init);
      return res.data;
    } catch (err) {
      if (isBackendError(err) && err.body.code === AuthErrorCode.REFRESH_TOKEN_DISABLES) {
        await auth?.onAuthInvalid?.("refresh_token_disabled");
        const init = createFetchLikeInit(method, params, {}, fetchOptions);
        const res = await requestJson<Response<R>>(fetchImpl, `${opts.origin}${endpoint}`, init);
        return res.data;
      }

      throw err;
    }
  };

  return {
    auth: {
      local: (params: ILoginUserDto) =>
        request<ILoginUserDto, ILocalApiResponse>("/api/auth/local/", "POST", params, { withToken: false }),

      signup: (data: IEmailRegisterUserDto) =>
        request("/api/user/register/email", "POST", data),

      refreshToken: (refreshToken: string) =>
        request<{ refreshToken: string }, IRefreshApiResponse>(
          "/api/auth/refresh-token/",
          "POST",
          { refreshToken },
          { withToken: false },
        ),

      forget: (data: { email: string }) => request("/api/user/send-rescue", "POST", data),

      verify: (data: { email: string; vertifyCode: string; nickName: string; password: string }) =>
        request("/api/user/vertify", "POST", data),

      checkVertify: (data: { email: string; vertifyCode: string }) =>
        request("/api/user/check-vertify", "POST", data),

      rescue: (data: { email: string; rescueCode: string; newPassword: string }) =>
        request("/api/user/rescue", "POST", data),

      logout: (refreshToken: string) => request("/api/auth/logout/", "POST", { refreshToken }),
    },

    user: {
      me: () => request<Empty, IUserDto>(`/api/user/profile`, "GET"),
      profile: (uuid: string, options?: { revalidate?: number | false }) =>
        request<Empty, IUserDto>(`/api/user/${uuid}/profile`, "GET", {}, { revalidate: options?.revalidate ?? 60 }),
      follow: (uuid: string) => request<Empty, Empty>(`/api/user/${uuid}/follow`, "POST"),
      unfollow: (uuid: string) => request<Empty, Empty>(`/api/user/${uuid}/unfollow`, "POST"),
      updateProfile: (dto: UpdateProfileDto) => request<UpdateProfileDto, IUserDto>(`/api/user/profile`, "PUT", dto),
      changePassword: (dto: ChangePasswordDto) => request<ChangePasswordDto, Empty>(`/api/user/password`, "PUT", dto),
      followers: (uuid: string, query: Partial<PageableQuery> = {}, options?: { revalidate?: number | false }) =>
        request<Empty, PaginatedResponse<IUserDto>>(`/api/user/${uuid}/followers?${qs.stringify(query)}`, "GET", {}, { revalidate: options?.revalidate ?? 60 }),
      followings: (uuid: string, query: Partial<PageableQuery> = {}, options?: { revalidate?: number | false }) =>
        request<Empty, PaginatedResponse<IUserDto>>(`/api/user/${uuid}/followings?${qs.stringify(query)}`, "GET", {}, { revalidate: options?.revalidate ?? 60 }),
    },

    pendant: {
      active: (uuid: string) => request(`/api/pendant/${uuid}/active`, "PUT"),
      inactive: () => request(`/api/pendant/inactive`, "PUT"),
    },

    module: {
      list: (params: Partial<IModListQuery> = {}, options?: { revalidate?: number | false }) =>
        request<Empty, ModListApiResponse>(`/api/mod?${qs.stringify(params)}`, "GET", {}, { revalidate: options?.revalidate ?? 60 }),
      detail: (id: string, options?: { revalidate?: number | false }) =>
        request<Empty, ModRetrieveApiResponse>(`/api/mod/${id}`, "GET", {}, { revalidate: options?.revalidate ?? 300 }),
      config: (options?: { revalidate?: number | false }) =>
        request<Empty, ModFilterConfig>(`/api/mod/config`, "GET", {}, { revalidate: options?.revalidate ?? 3600 }),
      random: (params: Partial<IModListQuery> = {}) =>
        request<Empty, ModRetrieveApiResponse>(`/api/mod/random?${qs.stringify(params)}`, "GET"),
      hot: (options?: { revalidate?: number | false }) =>
        request<Empty, PaginatedResponse<IModDto>>(`/api/mod/hot`, "GET", {}, { revalidate: options?.revalidate ?? 300 }),
      publish: (payload: PublishModPayload) =>
        request<PublishModPayload & { isForeign: false }, IModDto>(`/api/mod`, "POST", { ...payload, isForeign: false }),
      contribute: (payload: ContributeModPayload) =>
        request<ContributeModPayload & { isForeign: true }, IModDto>(`/api/mod`, "POST", { ...payload, isForeign: true }),
      update: (id: string, payload: ModUpsertPayload) => request<ModUpsertPayload, IModDto>(`/api/mod/${id}`, "PUT", payload),
      recommend: (id: string) => request<Empty, ModListApiResponse>(`/api/mod/${id}/recommend`, "GET"),
    },

    collection: {
      mine: () => request<Empty, Array<CollectionDto>>(`/api/collection/mine`, "GET"),
      list: (params: Partial<CollectionListQuery> = {}, options?: { revalidate?: number | false }) => {
        const query = qs.stringify(params);
        const endpoint = query ? `/api/collection?${query}` : `/api/collection`;
        return request<Empty, CollectionListResponse>(endpoint, "GET", {}, { revalidate: options?.revalidate ?? 300 });
      },
      detail: (uuid: string) => request<Empty, CollectionDto>(`/api/collection/${uuid}`, "GET"),
      items: (uuid: string) => request<Empty, CollectionItemsResponse>(`/api/collection/${uuid}/items`, "GET"),
      create: (payload: CreateCollectionDto) => request<CreateCollectionDto, CollectionDto>(`/api/collection/`, "POST", payload),
      update: (uuid: string, dto: UpdateCollectionDto) =>
        request<UpdateCollectionDto, CollectionDto>(`/api/collection/${uuid}`, "PUT", dto),
      delete: (uuid: string) => request<Empty, Empty>(`/api/collection/${uuid}`, "DELETE"),
      favorite: (id: string) => request<Empty, CollectionDto>(`/api/collection/${id}/favorite`, "PUT"),
      cancelFavorite: (id: string) => request<Empty, CollectionDto>(`/api/collection/${id}/cancelFavorite`, "PUT"),
    },

    rate: {
      list: (params: Partial<IRateListQuery> = {}) =>
        request<Empty, IRateListApiResponse>(`/api/rate?${qs.stringify(params)}`, "GET"),
      detail: (id: string) => request<Empty, IRateDto>(`/api/rate/${id}`, "GET"),
      create: (
        modId: string,
        payload: { rate?: number; remark?: string; remarkType: string; type: number; view?: number; isAnonymous?: boolean; accessLevel?: string },
      ) => request<typeof payload, IRateDto>(`/api/rate/mod/${modId}`, "POST", payload),
      update: (
        id: string,
        payload: Partial<{ rate: number; remark: string; remarkType: string; type: number; view: number; isAnonymous: boolean; accessLevel: string }>,
      ) => request<typeof payload, IRateDto>(`/api/rate/${id}`, "PUT", payload),
      delete: (id: string) => request<Empty, Empty>(`/api/rate/${id}`, "DELETE"),
    },

    like: {
      declare: (targetName: string, targetId: string, attitude: "like" | "dislike" | "happy") =>
        request<{ targetName: string; targetId: string; attitude: string }, DeclareResponse>(
          `/api/like/declare/`,
          "POST",
          { targetName, targetId, attitude }
        ),
      cancelDeclare: (targetName: string, targetId: string, attitude: "like" | "dislike" | "happy") =>
        request<{ targetName: string; targetId: string; attitude: string }, DeclareResponse>(
          `/api/like/declare/cancel`,
          "POST",
          { targetName, targetId, attitude }
        ),
    },

    comment: {
      list: (targetName: string, targetId: string, query: Partial<CommentQuery> = {}) => {
        const queryString = qs.stringify(query);
        const endpoint = queryString ? `/api/comment/${targetName}/${targetId}?${queryString}` : `/api/comment/${targetName}/${targetId}`;
        return request<Empty, PaginatedResponse<ParentCommentDto>>(endpoint, "GET");
      },
      replies: (commentId: string, query: Partial<CommentRepliesQuery> = {}) => {
        const queryString = qs.stringify(query);
        const endpoint = queryString ? `/api/comment/${commentId}/replies?${queryString}` : `/api/comment/${commentId}/replies`;
        return request<Empty, PaginatedResponse<ReplyDto>>(endpoint, "GET");
      },
      reply: (commentId: string, payload: { content: string }) =>
        request<{ content: string }, ReplyDto>(`/api/comment/${commentId}/reply`, "POST", payload),
      create: (targetName: string, targetId: string, payload: { content: string }) =>
        request<{ content: string }, ParentCommentDto>(`/api/comment/${targetName}/${targetId}`, "POST", payload),
      delete: (commentId: string) => request<Empty, Empty>(`/api/comment/${commentId}`, "DELETE"),
      dialog: (commentId: string) => request<Empty, ReplyDto[]>(`/api/comment/${commentId}/dialog`, "GET"),
    },

    search: {
      tag: (params: Partial<TagQuery> = {}) =>
        request<Empty, PaginatedResponse<ITag>>(`/api/tag?${qs.stringify(params)}`, "GET"),
      topic: (params: Partial<TopicListQuery> = {}) =>
        request<Empty, PaginatedResponse<ITopicDto>>(`/api/topic/search?${qs.stringify(params)}`, "GET"),
      user: (params: Partial<PageableQuery & { keyword?: string }> = {}) =>
        request<Empty, PaginatedResponse<IUserDto>>(`/api/user/search?${qs.stringify(params)}`, "GET"),
    },

    tag: {
      modRecommend: (options?: { revalidate?: number | false }) =>
        request<Empty, ITag[]>(`/api/tag/modRecommend`, "GET", {}, { revalidate: options?.revalidate ?? 3600 }),
    },

    config: {
      banner: (options?: { revalidate?: number | false }) =>
        request<Empty, BannerDto[]>(`/api/config/banner`, "GET", {}, { revalidate: options?.revalidate ?? 300 }),
    },

    file: {
      assume: () => request<Empty, OSSCredentials>(`/api/file/assume`, "GET"),
      uploadFromUrl: (url: string) =>
        request<{ url: string }, { url: string }>(`/api/file/upload_from_url`, "POST", { url }),
    },

    log: {
      list: (targetName: string, targetId: string, query: Partial<{ page: number; pageSize: number; action: string }> = {}) =>
        request<Empty, PaginatedResponse<OperationLogDto>>(`/api/log/${targetName}/${targetId}/?${qs.stringify(query)}`, "GET"),
    },

    notification: {
      list: (params: Partial<NotificationListQuery> = {}) =>
        request<Empty, NotificationPaginatedResponse<INotificationDto>>(`/api/notification?${qs.stringify(params)}`, "GET"),
      markRead: (uuid: string) => request<Empty, INotificationDto>(`/api/notification/${uuid}/mark`, "POST"),
      markAllRead: () => request<Empty, Empty>(`/api/notification/markAll`, "POST"),
    },
  };
}

export type DicechoApi = ReturnType<typeof createDicechoApi>;

export type { APIClientOptions };
