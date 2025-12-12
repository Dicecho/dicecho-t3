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
  APIClient,
  type APIClientOptions,
  type FetchLikeInit,
} from "./apiClient";
import { jwtDecode } from "jwt-decode";
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

export class DicechoApi extends APIClient {
  private refreshToken?: string;

  constructor(opts: APIClientOptions) {
    super(opts);
  }

  setToken(token: { refreshToken?: string; accessToken?: string }) {
    this.refreshToken = token.refreshToken;
    if (token.accessToken) {
      this.setAuthorization(token.accessToken);
    } else {
      this.clearAuthorization();
    }
  }

  private clearAuthorization = () => {
    this.setHeader("Authorization");
  };

  private setAuthorization = (accessToken: string) => {
    this.setHeader("Authorization", `Bearer ${accessToken}`);
  };

  protected async request<P extends object, R extends object>(
    endpoint: string,
    method: FetchLikeInit["method"],
    params: P = {} as P,
    { withToken = true, revalidate, tags }: { withToken?: boolean; revalidate?: number | false; tags?: string[] } = {},
  ): Promise<R> {

    const accessToken = this.header.Authorization?.split(" ")[1];
    const fetchOptions = revalidate !== undefined || tags ? { revalidate, tags } : undefined;

    if (this.refreshToken && accessToken && withToken) {
      const decode = jwtDecode(accessToken);

      if (decode.exp && decode.exp * 1000 < Date.now()) {
        this.clearAuthorization();
        await this.auth
          .refreshToken(this.refreshToken)
          .then((res) => {
            this.setToken(res);
          })
          .catch(() => {
            this.setToken({});
          });
        return super
          .request<P, Response<R>>(endpoint, method, params, fetchOptions)
          .then((res) => res.data);
      }
    }

    return super
      .request<P, Response<R>>(endpoint, method, params, fetchOptions)
      .then((res) => res.data)
      .catch(async (err: Error) => {
        if (isBackendError(err)) {
          if (err.body.code === AuthErrorCode.REFRESH_TOKEN_DISABLES) {
            this.clearAuthorization();
            return super
              .request<P, Response<R>>(endpoint, method, params, fetchOptions)
              .then((res) => res.data);
          }
        }
        throw err;
      });
  }

  auth = {
    local: (params: ILoginUserDto) =>
      this.request<ILoginUserDto, ILocalApiResponse>(
        "/api/auth/local/",
        "POST",
        params,
        { withToken: false },
      ),

    signup: (data: IEmailRegisterUserDto) =>
      this.request("/api/user/register/email", "POST", data),

    refreshToken: (refreshToken: string) =>
      this.request<{ refreshToken: string }, IRefreshApiResponse>(
        "/api/auth/refresh-token/",
        "POST",
        {
          refreshToken,
        },
        { withToken: false },
      ),

    forget: (data: { email: string }) =>
      this.request("/api/user/send-rescue", "POST", data),

    verify: (data: {
      email: string;
      vertifyCode: string;
      nickName: string;
      password: string;
    }) => this.request("/api/user/vertify", "POST", data),

    checkVertify: (data: { email: string; vertifyCode: string }) =>
      this.request("/api/user/check-vertify", "POST", data),

    rescue: (data: {
      email: string;
      rescueCode: string;
      newPassword: string;
    }) => this.request("/api/user/rescue", "POST", data),

    logout: (refreshToken: string) =>
      this.request("/api/auth/logout/", "POST", {
        refreshToken,
      }),
  };

  user = {
    me: () => {
      return this.request<Empty, IUserDto>(`/api/user/profile`, "GET");
    },

    profile: (uuid: string) => {
      return this.request<Empty, IUserDto>(`/api/user/${uuid}/profile`, "GET");
    },

    follow: (uuid: string) => {
      return this.request<Empty, IUserDto>(`/api/user/${uuid}/follow`, "POST");
    },

    unfollow: (uuid: string) => {
      return this.request<Empty, IUserDto>(
        `/api/user/${uuid}/unfollow`,
        "POST",
      );
    },

    updateProfile: (dto: UpdateProfileDto) => {
      return this.request<UpdateProfileDto, IUserDto>(
        `/api/user/profile`,
        "PUT",
        dto,
      );
    },

    changePassword: (dto: ChangePasswordDto) => {
      return this.request<ChangePasswordDto, Empty>(
        `/api/user/password`,
        "PUT",
        dto,
      );
    },

    followers: (uuid: string, query: Partial<PageableQuery> = {}) => {
      return this.request<Empty, PaginatedResponse<IUserDto>>(
        `/api/user/${uuid}/followers?${qs.stringify(query)}`,
        "GET",
      );
    },

    followings: (uuid: string, query: Partial<PageableQuery> = {}) => {
      return this.request<Empty, PaginatedResponse<IUserDto>>(
        `/api/user/${uuid}/followings?${qs.stringify(query)}`,
        "GET",
      );
    },
  };

  pendant = {
    active: (uuid: string) =>
      this.request(`/api/pendant/${uuid}/active`, "PUT"),
    inactive: () => this.request(`/api/pendant/inactive`, "PUT"),
  };

  module = {
    list: (params: Partial<IModListQuery> = {}, options?: { revalidate?: number | false }) =>
      this.request<Empty, ModListApiResponse>(
        `/api/mod?${qs.stringify(params)}`,
        "GET",
        {},
        { revalidate: options?.revalidate ?? 60 }, // Default 60s cache
      ),
    detail: (id: string, options?: { revalidate?: number | false }) =>
      this.request<Empty, ModRetrieveApiResponse>(`/api/mod/${id}`, "GET", {}, { revalidate: options?.revalidate ?? 300 }),
    config: (options?: { revalidate?: number | false }) =>
      this.request<Empty, ModFilterConfig>(`/api/mod/config`, "GET", {}, { revalidate: options?.revalidate ?? 3600 }),
    random: (params: Partial<IModListQuery> = {}) =>
      this.request<Empty, ModRetrieveApiResponse>(
        `/api/mod/random?${qs.stringify(params)}`,
        "GET",
      ),
    hot: () =>
      this.request<Empty, PaginatedResponse<IModDto>>(`/api/mod/hot`, "GET"),
    publish: (payload: PublishModPayload) =>
      this.request<PublishModPayload & { isForeign: false }, IModDto>(`/api/mod`, "POST", {
        ...payload,
        isForeign: false,
      }),
    contribute: (payload: ContributeModPayload) =>
      this.request<ContributeModPayload & { isForeign: true }, IModDto>(`/api/mod`, "POST", {
        ...payload,
        isForeign: true,
      }),
    update: (id: string, payload: ModUpsertPayload) =>
      this.request<ModUpsertPayload, IModDto>(
        `/api/mod/${id}`,
        "PUT",
        payload,
      ),
    recommend: (id: string) =>
      this.request<Empty, ModListApiResponse>(`/api/mod/${id}/recommend`, "GET"),
  };

  collection = {
    mine: () =>
      this.request<Empty, Array<CollectionDto>>(`/api/collection/mine`, "GET"),
    list: (params: Partial<CollectionListQuery> = {}) => {
      const query = qs.stringify(params);
      const endpoint = query ? `/api/collection?${query}` : `/api/collection`;
      return this.request<Empty, CollectionListResponse>(endpoint, "GET");
    },
    detail: (uuid: string) =>
      this.request<Empty, CollectionDto>(`/api/collection/${uuid}`, "GET"),
    items: (uuid: string) =>
      this.request<Empty, CollectionItemsResponse>(
        `/api/collection/${uuid}/items`,
        "GET",
      ),
    create: (payload: CreateCollectionDto) =>
      this.request<CreateCollectionDto, CollectionDto>(
        `/api/collection/`,
        "POST",
        payload,
      ),
    update: (uuid: string, dto: UpdateCollectionDto) =>
      this.request<UpdateCollectionDto, CollectionDto>(
        `/api/collection/${uuid}`,
        "PUT",
        dto,
      ),
    delete: (uuid: string) =>
      this.request<Empty, Empty>(`/api/collection/${uuid}`, "DELETE"),
    favorite: (id: string) =>
      this.request<Empty, CollectionDto>(
        `/api/collection/${id}/favorite`,
        "PUT",
      ),
    cancelFavorite: (id: string) =>
      this.request<Empty, CollectionDto>(
        `/api/collection/${id}/cancelFavorite`,
        "PUT",
      ),
  };

  rate = {
    list: (params: Partial<IRateListQuery> = {}) =>
      this.request<Empty, IRateListApiResponse>(
        `/api/rate?${qs.stringify(params)}`,
        "GET",
      ),
    detail: (id: string) =>
      this.request<Empty, IRateDto>(`/api/rate/${id}`, "GET"),
    create: (
      modId: string,
      payload: {
        rate?: number;
        remark?: string;
        remarkType: string;
        type: number;
        view?: number;
        isAnonymous?: boolean;
        accessLevel?: string;
      },
    ) =>
      this.request<typeof payload, IRateDto>(
        `/api/rate/mod/${modId}`,
        "POST",
        payload,
      ),
    update: (
      id: string,
      payload: Partial<{
        rate: number;
        remark: string;
        remarkType: string;
        type: number;
        view: number;
        isAnonymous: boolean;
        accessLevel: string;
      }>,
    ) =>
      this.request<typeof payload, IRateDto>(`/api/rate/${id}`, "PUT", payload),
    delete: (id: string) =>
      this.request<Empty, Empty>(`/api/rate/${id}`, "DELETE"),
  };

  comment = {
    list: (
      targetName: string,
      targetId: string,
      query: Partial<CommentQuery> = {},
    ) => {
      const queryString = qs.stringify(query);
      const endpoint = queryString
        ? `/api/comment/${targetName}/${targetId}?${queryString}`
        : `/api/comment/${targetName}/${targetId}`;

      return this.request<Empty, PaginatedResponse<ParentCommentDto>>(
        endpoint,
        "GET",
      );
    },
    replies: (commentId: string, query: Partial<CommentRepliesQuery> = {}) => {
      const queryString = qs.stringify(query);
      const endpoint = queryString
        ? `/api/comment/${commentId}/replies?${queryString}`
        : `/api/comment/${commentId}/replies`;

      return this.request<Empty, PaginatedResponse<ReplyDto>>(endpoint, "GET");
    },
    reply: (commentId: string, payload: { content: string }) =>
      this.request<{ content: string }, ReplyDto>(
        `/api/comment/${commentId}/reply`,
        "POST",
        payload,
      ),
    create: (targetName: string, targetId: string, payload: { content: string }) =>
      this.request<{ content: string }, ParentCommentDto>(
        `/api/comment/${targetName}/${targetId}`,
        "POST",
        payload,
      ),
    delete: (commentId: string) =>
      this.request<Empty, Empty>(`/api/comment/${commentId}`, "DELETE"),
    dialog: (commentId: string) =>
      this.request<Empty, ReplyDto[]>(`/api/comment/${commentId}/dialog`, "GET"),
  };

  search = {
    tag: (params: Partial<TagQuery> = {}) =>
      this.request<Empty, PaginatedResponse<ITag>>(
        `/api/tag?${qs.stringify(params)}`,
        "GET",
      ),
    topic: (params: Partial<TopicListQuery> = {}) =>
      this.request<Empty, PaginatedResponse<ITopicDto>>(
        `/api/topic/search?${qs.stringify(params)}`,
        "GET",
      ),
    user: (params: Partial<PageableQuery & { keyword?: string }> = {}) =>
      this.request<Empty, PaginatedResponse<IUserDto>>(
        `/api/user/search?${qs.stringify(params)}`,
        "GET",
      ),
  };

  tag = {
    modRecommend: (options?: { revalidate?: number | false }) =>
      this.request<Empty, ITag[]>(
        `/api/tag/modRecommend`,
        "GET",
        {},
        { revalidate: options?.revalidate ?? 3600 },
      ),
  };

  config = {
    banner: () =>
      this.request<Empty, BannerDto[]>(`/api/config/banner`, "GET"),
  };

  file = {
    assume: () =>
      this.request<Empty, OSSCredentials>(`/api/file/assume`, "GET"),
    uploadFromUrl: (url: string) =>
      this.request<{ url: string }, { url: string }>(
        `/api/file/upload_from_url`,
        "POST",
        { url },
      ),
  };

  log = {
    list: (
      targetName: string,
      targetId: string,
      query: Partial<{ page: number; pageSize: number; action: string }> = {},
    ) =>
      this.request<Empty, PaginatedResponse<OperationLogDto>>(
        `/api/log/${targetName}/${targetId}/?${qs.stringify(query)}`,
        "GET",
      ),
  };

  notification = {
    list: (params: Partial<NotificationListQuery> = {}) =>
      this.request<Empty, NotificationPaginatedResponse<INotificationDto>>(
        `/api/notification?${qs.stringify(params)}`,
        "GET",
      ),
    markRead: (uuid: string) =>
      this.request<Empty, INotificationDto>(
        `/api/notification/${uuid}/mark`,
        "POST",
      ),
    markAllRead: () =>
      this.request<Empty, Empty>(`/api/notification/markAll`, "POST"),
  };
}

export type { APIClientOptions };
