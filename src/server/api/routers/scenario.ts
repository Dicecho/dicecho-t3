import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Document, ObjectId } from "mongodb";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type {
  ScenarioDocument,
  UserRef,
} from "@/server/db/schemas/scenario.types";

const DEFAULT_COVER_URL =
  "https://file.dicecho.com/images/95AB141E8F2D6985E038CB3D97DB2BBF.png";

const ScenariolListItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  coverUrl: z.string(),
  tags: z.array(z.string()),
  rateAvg: z.number(),
  rateCount: z.number(),
  moduleRule: z.string(),
  languages: z.array(z.string()),
  playerNumber: z.array(z.number()),
  author: z.object({
    _id: z.string().optional(),
    isForeign: z.boolean(),
    nickName: z.string(),
    avatarUrl: z.string(),
  }),
});

export type ScenariolListItem = z.infer<typeof ScenariolListItemSchema>;

const ScenariolListApiResponseSchema = z.object({
  data: z.array(ScenariolListItemSchema),
  totalCount: z.number(),
  nextCursor: z.number(),
  pageSize: z.number(),
  hasNext: z.boolean(),
});

export type ScenariolListApiResponse = z.infer<
  typeof ScenariolListApiResponseSchema
>;

type DetailAggResult = Omit<ScenarioDocument, "author" | "contributors"> & {
  author?: UserRef;
  contributors: UserRef[];
};

export const scenarioRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(12),
        sort: z.record(z.union([z.literal(1), z.literal(-1)])).optional(),
        keyword: z.string().optional(),
        ids: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        tagsMode: z.enum(["all", "in"]).default("all"),
        minPlayer: z.number().optional(),
        maxPlayer: z.number().optional(),
        filter: z
          .object({
            origin: z.string().optional(),
            moduleRule: z.string().optional(),
            rateCount: z
              .object({
                $gte: z.number().optional(),
                $lte: z.number().optional(),
                $gt: z.number().optional(),
                $lt: z.number().optional(),
              })
              .optional(),
            author: z.string().optional(),
            isForeign: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .output(ScenariolListApiResponseSchema)
    .query(async ({ input, ctx }) => {
      const scenarios = ctx.db.collection<ScenarioDocument>("mods");

      const {
        cursor: page,
        pageSize,
        sort = { _id: -1 },
        keyword,
        ids,
        tags,
        filter,
        languages,
        tagsMode,
        minPlayer,
        maxPlayer,
      } = input;

      const trimmedKeyword = keyword?.trim();
      const match: Record<string, unknown> = { invalid: false };

      if (ids?.length) match._id = { $in: ids.map((id) => new ObjectId(id)) };
      if (languages?.length) match.languages = { $all: languages };
      if (tags?.length)
        match.tags = { [tagsMode === "all" ? "$all" : "$in"]: tags };
      if (minPlayer) match["playerNumber.0"] = { $lte: minPlayer };
      if (maxPlayer) match["playerNumber.1"] = { $gte: maxPlayer };
      if (filter?.moduleRule) match.moduleRule = filter.moduleRule;
      if (filter?.origin) match.origin = filter.origin;
      if (filter?.rateCount) match.rateCount = filter.rateCount;
      if (filter?.author) match.author = filter.author;
      if (filter?.isForeign) match.isForeign = filter.isForeign;
      if (
        sort &&
        Object.keys(sort).findIndex((key) => key === "rateAvg") !== -1
      ) {
        match.$or = [
          { validRateCount: { $exists: false }, rateCount: { $gte: 5 } },
          { validRateCount: { $gte: 5 } },
        ];
      }

      // Atlas Search 优先，用于替换 regex 方案
      const pipeline: Document[] = [];

      if (trimmedKeyword) {
        pipeline.push({
          $search: {
            index: "mods",
            phrase: {
              query: trimmedKeyword,
              path: { wildcard: "*" },
            },
          },
        });
      }

      pipeline.push({ $match: match });

      const facetPipeline: Document[] = [
        {
          $facet: {
            data: [
              { $sort: trimmedKeyword ? sort : { ...sort, _id: -1 } },
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize },
              {
                $lookup: {
                  from: "users",
                  localField: "author",
                  foreignField: "_id",
                  as: "authorData",
                },
              },
              {
                $addFields: {
                  authorDoc: { $arrayElemAt: ["$authorData", 0] },
                },
              },
              {
                $addFields: {
                  author: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$isForeign", true] },
                          then: {
                            isForeign: true,
                            nickName: {
                              $ifNull: ["$foreignAuthor.nickName", "Unknown"],
                            },
                            avatarUrl: {
                              $ifNull: ["$foreignAuthor.avatarUrl", ""],
                            },
                          },
                        },
                        {
                          case: { $ne: ["$authorDoc", null] },
                          then: {
                            isForeign: false,
                            _id: "$authorDoc._id",
                            nickName: "$authorDoc.nickName",
                            avatarUrl: "$authorDoc.avatarUrl",
                          },
                        },
                      ],
                      default: {
                        isForeign: true,
                        nickName: "Unknown",
                        avatarUrl: "",
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  coverUrl: 1,
                  tags: 1,
                  rateAvg: 1,
                  rateCount: 1,
                  moduleRule: 1,
                  languages: 1,
                  playerNumber: 1,
                  author: 1,
                },
              },
            ],
            total: [{ $count: "count" }],
          },
        },
        {
          $project: {
            data: "$data",
            totalCount: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
          },
        },
      ];

      const aggResult = await scenarios
        .aggregate<{
          data: ScenariolListItem[];
          totalCount: number;
        }>([...pipeline, ...facetPipeline])
        .toArray();

      const { data = [], totalCount = 0 } = aggResult[0] ?? {};

      const response: ScenariolListApiResponse = {
        data: data.map((s) => ({
          _id: s._id.toString(),
          title: s.title,
          coverUrl: s.coverUrl || DEFAULT_COVER_URL,
          tags: s.tags || [],
          rateAvg: parseFloat((s.rateAvg || 0).toFixed(1)),
          rateCount: s.rateCount || 0,
          moduleRule: s.moduleRule,
          languages: s.languages || [],
          playerNumber: Array.isArray(s.playerNumber)
            ? s.playerNumber.map((n) => n ?? 0)
            : [0, 0],
          author: {
            isForeign: s.author.isForeign,
            nickName: s.author.nickName,
            avatarUrl: s.author.avatarUrl,
            _id: s.author._id?.toString(),
          },
        })),
        totalCount,
        nextCursor: page + 1,
        pageSize,
        hasNext: totalCount > page * pageSize,
      };

      return response;
    }),

  // Get scenario detail - all fields
  detail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const scenarios = ctx.db.collection<ScenarioDocument>("mods");

      const [scenario] = await scenarios
        .aggregate([
          { $match: { _id: new ObjectId(input.id) } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "authorData",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "contributors",
              foreignField: "_id",
              as: "contributorsData",
            },
          },
          {
            $addFields: {
              author: { $arrayElemAt: ["$authorData", 0] },
              contributors: "$contributorsData",
            },
          },
          {
            $project: {
              authorData: 0,
              contributorsData: 0,
            },
          },
        ])
        .toArray();

      if (!scenario || (scenario as ScenarioDocument).invalid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const s = scenario as DetailAggResult;

      return {
        _id: s._id.toString(),
        title: s.title,
        originTitle: s.originTitle,
        alias: s.alias,
        description: s.description,
        coverUrl: s.coverUrl,
        origin: s.origin,
        originUrl: s.originUrl,
        imageUrls: s.imageUrls,
        playerNumber: Array.isArray(s.playerNumber)
          ? s.playerNumber.map((n) => n ?? 0)
          : [0, 0],
        boothAliaseId: s.boothAliaseId,
        cnmodsAliaseId: s.cnmodsAliaseId,
        moduleRule: s.moduleRule,
        moduleDownloadUrl: s.moduleDownloadUrl,
        relatedLinks: s.relatedLinks,
        modFiles: s.modFiles.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
          type: f.type,
          clickCount: f.clickCount || 0,
        })),
        tags: s.tags,
        releaseDate: s.releaseDate,
        author:
          s.isForeign && s.foreignAuthor
            ? {
                isForeign: true as const,
                nickName: s.foreignAuthor.nickName,
                avatarUrl: s.foreignAuthor.avatarUrl ?? "",
              }
            : s.author
              ? {
                  isForeign: false as const,
                  _id: s.author._id.toString(),
                  nickName: s.author.nickName,
                  avatarUrl: s.author.avatarUrl,
                }
              : {
                  isForeign: true as const,
                  nickName: "Unknown",
                  avatarUrl: "",
                },
        contributors: (s.contributors || []).map((c) => ({
          _id: c._id.toString(),
          nickName: c.nickName,
          avatarUrl: c.avatarUrl,
        })),
        languages: s.languages,
        rateAvg: s.rateAvg || 0,
        validRateCount: s.validRateCount || s.rateCount,
        rateCount: s.rateCount || 0,
        markCount: s.markCount || 0,
        replayCount: s.replayCount,
        topicCount: s.topicCount,
        rateInfo: s.rateInfo || {},
        isForeign: s.isForeign,
        isNSFW: s.isNSFW,
        lastEditAt: s.lastEditAt,
        canEdit: false,
        canDownload: !s.isForeign && s.modFiles.length > 0,
      };
    }),
});
