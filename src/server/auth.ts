import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { IUserDto } from '@dicecho/types'
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env";
import { DicechoApi, isBackendError } from "@/utils/api";
import { getTranslation } from "@/lib/i18n";
import { fallbackLng, languages } from "@/lib/i18n/settings";
import acceptLanguage from "accept-language";

/**s
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"] & Token & IUserDto & JWTRes;
  }

  interface Token {
    // ...other properties
    // role: UserRole;
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWTRes {
    iat: number,
    exp: number,
    jti: string,
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      // 首次登录时，user 对象存在，保存用户数据和 token
      if (user) {
        return { ...token, ...user };
      }
      // 后续请求时，user 为 undefined，返回现有 token
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Dicecho",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const api = new DicechoApi({
          origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT,
        });

        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        // 从请求中获取语言信息
        let lng = fallbackLng;
        if (req?.headers) {
          // NextAuth 的 req.headers 是普通对象，不是 Headers 实例
          const headers = req.headers as Record<string, string | string[] | undefined>;
          
          // 尝试从 URL 路径中提取语言
          const referer = Array.isArray(headers.referer) ? headers.referer[0] : headers.referer;
          const xUrl = Array.isArray(headers["x-url"]) ? headers["x-url"][0] : headers["x-url"];
          const url = referer || xUrl || "";
          
          if (url) {
            try {
              const urlObj = new URL(url);
              const pathParts = urlObj.pathname.split("/").filter(Boolean);
              if (pathParts.length > 0 && languages.includes(pathParts[0] as typeof languages[number])) {
                lng = pathParts[0] as typeof languages[number];
              }
            } catch {
              // 如果 URL 解析失败，使用 Accept-Language header
              const acceptLang = Array.isArray(headers["accept-language"]) 
                ? headers["accept-language"][0] 
                : headers["accept-language"];
              if (acceptLang) {
                acceptLanguage.languages(languages);
                const detected = acceptLanguage.get(acceptLang);
                if (detected && languages.includes(detected as typeof languages[number])) {
                  lng = detected as typeof languages[number];
                }
              }
            }
          } else {
            // 如果没有 URL，尝试从 Accept-Language header 获取
            const acceptLang = Array.isArray(headers["accept-language"]) 
              ? headers["accept-language"][0] 
              : headers["accept-language"];
            if (acceptLang) {
              acceptLanguage.languages(languages);
              const detected = acceptLanguage.get(acceptLang);
              if (detected && languages.includes(detected as typeof languages[number])) {
                lng = detected as typeof languages[number];
              }
            }
          }
        }

        // 获取翻译函数
        const { t } = await getTranslation(lng);

        try {
          const token = await api.auth.local({ email, password });

          api.setToken(token);
          const user = await api.user.me();

          if (token && user) {
            return {
              id: user._id,
              ...user,
              ...token,
            };
          }

          // Return null if user data could not be retrieved
          return null;
        } catch (err) {
          console.error("Login error:", err);
          
          // 如果是后端错误，提取错误信息
          if (isBackendError(err)) {
            // 优先使用后端返回的错误信息，如果没有则使用翻译的默认错误信息
            const errorMessage = err.body.detail || t("login_error_default");
            // NextAuth 会将抛出的错误消息传递到 signIn 的 error 字段
            throw new Error(errorMessage);
          }
          
          // 其他错误，使用翻译的通用错误信息
          throw new Error(t("login_error_retry"));
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
