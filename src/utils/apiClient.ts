const API_ERROR = Symbol();

export type APIError = {
  id: string;
  code: string;
  message: string;
  kind: "client" | "server";
  info: Record<string, unknown>;
};

export function isAPIError(reason: unknown): reason is APIError {
  if (typeof reason !== "object" || reason === null) {
    return false;
  }

  if (API_ERROR in reason) {
    return reason[API_ERROR] === true;
  }

  return false;
}

export type FetchLikeInit = {
  method?: "POST" | "GET" | "UPDATE" | "PUT" | "DELETE";
  body?: string;
  cache?: RequestCache;
  headers: { [key in string]: string };
};

export type FetchLike<R = unknown> = (
  input: string,
  init?: FetchLikeInit,
) => Promise<{
  status: number;
  json(): Promise<R>;
}>;

export type APIClientOptions = {
  origin: APIClient["origin"];
  fetch?: APIClient["fetch"] | null | undefined;
};

export class APIClient {
  protected origin: string;
  protected fetch: FetchLike;
  protected header: { [key in string]: string } = {};

  public setHeader(key: string, value?: string) {
    if (!value) {
      delete this.header[key];
      return;
    }

    this.header[key] = value;
  }

  constructor(opts: APIClientOptions) {
    this.origin = opts.origin;
    this.fetch = opts.fetch ?? ((...args) => fetch(...args));
  }

  protected request<P extends object, R extends object>(
    endpoint: string,
    method: FetchLikeInit["method"],
    params: P = {} as P,
    fetchOptions?: { revalidate?: number | false; tags?: string[] },
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const init: FetchLikeInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...this.header,
        },
        // Remove hardcoded cache: "no-cache" to allow Next.js caching
        // Only disable cache for mutations (POST, PUT, DELETE)
        ...(method !== "GET" ? { cache: "no-cache" as RequestCache } : {}),
      };

      // Add Next.js specific cache options for GET requests
      if (method === "GET" && fetchOptions) {
        init.next = fetchOptions;
      }

      if (Object.keys(params).length !== 0) {
        Object.assign(init, {
          body: JSON.stringify({
            ...params,
          }),
        });
      }

      this.fetch(`${this.origin}${endpoint}`, init)
        .then(async (res) => {
          const body = res.status === 204 ? null : await res.json();

					if (res.status >= 200 && res.status < 400) {
            resolve(body as R);
          } else {
            reject({
              [API_ERROR]: true,
              body,
            });
          }
        })
        .catch(reject);
    });
  }
}
