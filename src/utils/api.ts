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
    { withToken = true }: { withToken?: boolean } = {},
  ): Promise<R> {

    const accessToken = this.header.Authorization?.split(" ")[1];

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
          .request<P, Response<R>>(endpoint, method, params)
          .then((res) => res.data);
      }
    }

    return super
      .request<P, Response<R>>(endpoint, method, params)
      .then((res) => res.data)
      .catch(async (err: Error) => {
        if (isBackendError(err)) {
          if (err.body.code === AuthErrorCode.REFRESH_TOKEN_DISABLES) {
            this.clearAuthorization();
            return super
              .request<P, Response<R>>(endpoint, method, params)
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
    list: (params: Partial<IModListQuery> = {}) =>
      this.request<Empty, ModListApiResponse>(
        `/api/mod?${qs.stringify(params)}`,
        "GET",
      ),
    detail: (id: string) =>
      this.request<Empty, ModRetrieveApiResponse>(`/api/mod/${id}`, "GET"),
    config: () =>
      this.request<Empty, ModFilterConfig>(`/api/mod/config`, "GET"),
    random: (params: Partial<IModListQuery> = {}) =>
      this.request<Empty, ModRetrieveApiResponse>(
        `/api/mod/random?${qs.stringify(params)}`,
        "GET",
      ),
    // create: (data: TokenCreateData) =>
    //   this.post<TokenCreateData, ServerTransaction>('/token', data),
    // update: (typeId: string, data: TokenUpdateData) =>
    //   this.put<TokenUpdateData, Token>(`/token/${typeId}`, data),
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
  };

  rate = {
    list: (params: Partial<IRateListQuery> = {}) =>
      this.request<Empty, IRateListApiResponse>(
        `/api/rate?${qs.stringify(params)}`,
        "GET",
      ),
    detail: (id: string) =>
      this.request<Empty, IRateDto>(`/api/rate/${id}`, "GET"),
  };
}

export type { APIClientOptions };
