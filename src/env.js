import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    PROXY_AGENT_URL: z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    MONGO_URI: z.string().url(),
    // AI Configuration
    AI_PROVIDER: z.enum(["openai", "azure"]).default("azure"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_BASE_URL: z.string().optional(),
    OPENAI_MODEL: z.string().optional(),
    // Azure OpenAI Configuration
    AZURE_OPENAI_API_KEY: z.string().optional(),
    AZURE_OPENAI_ENDPOINT: z.string().optional(),
    AZURE_OPENAI_DEPLOYMENT: z.string().optional(),
    AZURE_OPENAI_API_VERSION: z.string().optional(),
    // GitHub Feedback Configuration
    GITHUB_APP_ID: z.string().optional(),
    GITHUB_APP_PK: z.string().optional(),
    GITHUB_INSTALLATION_ID: z.string().optional(),
    GITHUB_OWNER: z.string().default("dicecho"),
    GITHUB_REPO: z.string().default("feedback"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DICECHO_API_ENDPOINT: z.string(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    PROXY_AGENT_URL: process.env.PROXY_AGENT_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_DICECHO_API_ENDPOINT: process.env.NEXT_PUBLIC_DICECHO_API_ENDPOINT,
    MONGO_URI: process.env.MONGO_URI,
    // AI Configuration
    AI_PROVIDER: process.env.AI_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    // Azure OpenAI Configuration
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
    AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION,
    // GitHub Feedback Configuration
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_APP_PK: process.env.GITHUB_APP_PK,
    GITHUB_INSTALLATION_ID: process.env.GITHUB_INSTALLATION_ID,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
