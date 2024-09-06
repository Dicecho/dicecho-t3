import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { IUserDto } from '@dicecho/types'
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env";
import { DicechoApi } from "@/utils/api";

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
      return { ...token, ...user };
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

        const token = await api.auth.local({ email, password }).catch((err) => {
          console.error("err", err);
          throw err;
        });

        api.setToken(token)
        const user = await api.user.me().catch((err) => {
          console.error("err", err);
          throw err;
        });

        if (token && user) {
          return {
            id: user._id,
            ...user,
            ...token,
          };
        }

        // Return null if user data could not be retrieved
        return null;
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
