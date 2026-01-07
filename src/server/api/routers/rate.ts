import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getDicechoServerApi } from "@/server/dicecho";
import { createDicechoApi } from "@/utils/api";
import { env } from "@/env";
import { translate, getLanguageDisplayName } from "@/server/services/ai";
import { getTranslationCache } from "@/server/services/translate-cache";
import { serializeRichTextToMarkdown } from "@/components/Editor/utils/platejson-serializer";
import { RemarkContentType } from "@dicecho/types";
import { LanguageCodes } from "@/utils/language";

export const rateRouter = createTRPCRouter({
  detail: publicProcedure
    .input(
      z.object({
        id: z.string(),
        // accessToken is used to get user-specific data (like isLiked)
        // also serves as queryKey differentiator for session changes
        accessToken: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // When accessToken is provided, fetch user-specific data without cache
      // When no accessToken, use cache (revalidate: 300) for public view
      if (input.accessToken) {
        const api = createDicechoApi({
          origin: env.NEXT_PUBLIC_DICECHO_API_ENDPOINT,
          auth: { getAccessToken: async () => input.accessToken },
        });
        return api.rate.detail(input.id, { revalidate: false });
      }
      const api = await getDicechoServerApi();
      return api.rate.detail(input.id, { revalidate: 300 });
    }),

  translate: publicProcedure
    .input(
      z.object({
        rateId: z.string(),
        targetLanguage: z.nativeEnum(LanguageCodes),
      })
    )
    .mutation(async ({ input }) => {
      const { rateId, targetLanguage } = input;
      const api = await getDicechoServerApi();

      let rate;
      try {
        rate = await api.rate.detail(rateId);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Rate not found: ${rateId}`,
        });
      }

      // Extract content for translation
      let content: string;
      const remarkType = rate.remarkType;
      const targetLang = getLanguageDisplayName(targetLanguage);

      if (remarkType === RemarkContentType.Richtext) {
        const richTextState = rate.richTextState;
        if (!richTextState || richTextState.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Rate has no content to translate",
          });
        }

        content = serializeRichTextToMarkdown(richTextState);
      } else {
        const remark = rate.remark;
        if (!remark || remark.trim().length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Rate has no content to translate",
          });
        }
        content = remark;
      }

      // Check cache (content-addressed: same content = same cache key)
      const cache = getTranslationCache();
      const cached = await cache.get(content, targetLanguage);
      if (cached) {
        return {
          translatedText: cached.translatedText,
          fromCache: true
        };
      }

      // Translate
      let translatedText: string;
      try {
        const result = await translate({
          text: content,
          targetLanguage: targetLang,
        });
        translatedText = result.translatedText;
      } catch (error) {
        console.log("Translation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Translation service is temporarily unavailable. Please try again later.",
        });
      }

      await cache.set(content, targetLanguage, translatedText);

      return {
        translatedText,
        fromCache: false,
      };
    }),
});
