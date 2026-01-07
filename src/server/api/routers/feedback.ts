import { z } from "zod";
import { App } from "@octokit/app";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";


async function getOctokit() {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PK || !env.GITHUB_INSTALLATION_ID) {
    throw new Error("GitHub App configuration is incomplete");
  }

  const app = new App({
    appId: env.GITHUB_APP_ID,
    privateKey: env.GITHUB_APP_PK,
  });

  return app.getInstallationOctokit(Number(env.GITHUB_INSTALLATION_ID));
}

export const feedbackRouter = createTRPCRouter({
  labels: publicProcedure.query(async () => {
    const octokit = await getOctokit();
    const response = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      per_page: 100,
    });

    return response.data;
  }),

  list: publicProcedure
    .input(
      z.object({
        state: z.enum(["open", "closed", "all"]).default("open"),
        labels: z.string().optional(),
        cursor: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const octokit = await getOctokit();
      const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        state: input.state,
        labels: input.labels,
        page: input.cursor,
        per_page: input.perPage + 1,
      });

      const hasNext = response.data.length > input.perPage;
      const issues = hasNext ? response.data.slice(0, input.perPage) : response.data;

      return {
        issues,
        nextCursor: input.cursor + 1,
        perPage: input.perPage,
        hasNext,
      };
    }),

  detail: publicProcedure
    .input(z.object({ number: z.number() }))
    .query(async ({ input }) => {
      const octokit = await getOctokit();
      const [issueRes, commentsRes] = await Promise.all([
        octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
          owner: env.GITHUB_OWNER,
          repo: env.GITHUB_REPO,
          issue_number: input.number,
        }),
        octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          owner: env.GITHUB_OWNER,
          repo: env.GITHUB_REPO,
          issue_number: input.number,
        }),
      ]);

      return {
        issue: issueRes.data,
        comments: commentsRes.data,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["bug", "feature", "question"]),
        title: z.string().min(1).max(256),
        body: z.string().min(1).max(65536),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const octokit = await getOctokit();
      const userName = ctx.session.user.nickName ?? ctx.session.user.name ?? "Anonymous";

      const userProfileUrl = `https://www.dicecho.com/account/${ctx.session.user.id}`;
      const formattedBody = `${input.body}

---

*Submitted by: [${userName}](${userProfileUrl}) via [Dicecho](https://dicecho.com)*`;

      const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        title: input.title,
        body: formattedBody,
        labels: ["from:site", input.type],
      });

      return {
        number: response.data.number,
        htmlUrl: response.data.html_url,
      };
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        issueNumber: z.number(),
        body: z.string().min(1).max(65536),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const octokit = await getOctokit();
      const userName = ctx.session.user.nickName ?? ctx.session.user.name ?? "Anonymous";
      const userProfileUrl = `https://www.dicecho.com/account/${ctx.session.user.id}`;

      const formattedBody = `${input.body}
---

*Comment by: [${userName}](${userProfileUrl}) via [Dicecho](https://dicecho.com)*`;

      const response = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        issue_number: input.issueNumber,
        body: formattedBody,
      });

      return {
        id: response.data.id,
        htmlUrl: response.data.html_url,
      };
    }),
});
