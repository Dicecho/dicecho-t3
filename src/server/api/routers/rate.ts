import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getDicechoServerApi } from "@/server/dicecho";
import { translate, getLanguageDisplayName } from "@/server/services/ai";
import {
  getCachedTranslation,
  setCachedTranslation,
} from "@/server/services/translate-cache";
import { RemarkContentType } from "@dicecho/types";
import { createSlateEditor, KEYS } from "platejs";
import { BaseEditorKit } from '@/components/Editor/editor-base-kit';
import { MarkdownPlugin } from "@platejs/markdown";

export const rateRouter = createTRPCRouter({
  translate: publicProcedure
    .input(
      z.object({
        rateId: z.string(),
        targetLanguage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { rateId, targetLanguage } = input;

      // Check cache
      const cached = await getCachedTranslation(rateId, targetLanguage);
      if (cached) {
        return {
          translatedText: cached.translatedText,
          fromCache: true
        };
      }

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

      let translatedText: string;
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

        // preprocess rich text state
        const preprocessedRichTextState = richTextState.map((node) => ({
          ...node,
          type: node.type ?? KEYS.p,
        }));

        const editorStatic = createSlateEditor({
          plugins: [...BaseEditorKit]
        });
        
        try {
          const markdown = editorStatic.getApi(MarkdownPlugin).markdown.serialize({ value: preprocessedRichTextState });
          const result = await translate({
            text: markdown,
            targetLanguage: targetLang,
          });
          translatedText = result.translatedText;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? `Translation failed: ${error.message}`
                : "Translation failed",
          });
        }

      } else {
        const content = rate.remark;
        if (!content || content.trim().length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Rate has no content to translate",
          });
        }

        try {
          const result = await translate({
            text: content,
            targetLanguage: targetLang,
          });
          translatedText = result.translatedText;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? `Translation failed: ${error.message}`
                : "Translation failed",
          });
        }
      }

      await setCachedTranslation(rateId, targetLanguage, translatedText);

      return {
        translatedText,
        fromCache: false,
      };
    }),
});
