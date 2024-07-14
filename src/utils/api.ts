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
} from "@dicecho/types";
import {
  APIClient,
  type APIClientOptions,
  type FetchLikeInit,
} from "./apiClient";
import { jwtDecode } from "jwt-decode";
import * as qs from "qs";

type Empty = Record<string, never>;

interface ModFilterConfig {
  rules: Array<{ _id: string; count: number }>;
  origins: Array<{ _id: string; count: number }>;
  languages: Array<{ _id: string; count: number }>;
}

export class DicechoApi extends APIClient {
  private refreshToken?: string;
  private expiredAt?: number;

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
  ): Promise<R> {
    const requestFn = super
      .request<P, Response<R>>(endpoint, method, params)
      .then((res) => res.data);

    const accessToken = this.header.Authorization?.split(" ")[1];

    if (this.refreshToken && accessToken) {
      const decode = jwtDecode(accessToken);

      if (decode.exp && decode.exp * 1000 < Date.now()) {
        this.clearAuthorization();
        const res = await this.auth.refreshToken(this.refreshToken);
        this.setToken(res);
        return requestFn;
      }
    }

    return requestFn;
  }

  auth = {
    local: (params: ILoginUserDto) =>
      this.request<ILoginUserDto, ILocalApiResponse>(
        "/api/auth/local/",
        "POST",
        params,
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
}

export type { APIClientOptions };
