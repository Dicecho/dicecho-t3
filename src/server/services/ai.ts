/**
 * AI Service - Unified interface for AI-related functionality
 *
 * Design principles:
 * 1. Simple and direct - one function per feature
 * 2. Pluggable providers - switch between AI services via configuration
 * 3. Type-safe - full TypeScript type support
 */

import { generateText } from "ai";
import { LanguageModelV3 } from '@ai-sdk/provider';
import { createAzure } from "@ai-sdk/azure";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/env";

// ============================================
// Types
// ============================================

export interface TranslateOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslateResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

// ============================================
// AI Model Configuration
// ============================================

let cachedModel: LanguageModelV3 | null = null;

const getModel = (): LanguageModelV3 => {
  if (cachedModel) return cachedModel;

  const provider = env.AI_PROVIDER ?? "openai";

  if (provider === "azure") {
    if (!env.AZURE_OPENAI_API_KEY) {
      throw new Error("AZURE_OPENAI_API_KEY is not configured");
    }
    if (!env.AZURE_OPENAI_ENDPOINT) {
      throw new Error("AZURE_OPENAI_ENDPOINT is not configured");
    }
    if (!env.AZURE_OPENAI_DEPLOYMENT) {
      throw new Error("AZURE_OPENAI_DEPLOYMENT is not configured");
    }

    const azure = createAzure({
      resourceName: new URL(env.AZURE_OPENAI_ENDPOINT).hostname.split(".")[0],
      apiKey: env.AZURE_OPENAI_API_KEY
    });
    cachedModel = azure(env.AZURE_OPENAI_DEPLOYMENT);
  } else {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const openai = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL,
    });
    cachedModel = openai(env.OPENAI_MODEL ?? "gpt-4o-mini");
  }

  return cachedModel;
};

// ============================================
// Public API
// ============================================

/**
 * translate - Translates text to the specified target language
 */
export async function translate({ text, targetLanguage, sourceLanguage }: TranslateOptions): Promise<TranslateResult> {
  const systemPrompt = `You are a professional translator. Translate the following text to ${targetLanguage}. 
Only output the translated text, nothing else. Preserve the original formatting and tone.
${sourceLanguage ? `The source language is ${sourceLanguage}.` : "Detect the source language automatically."}`;

  const { text: translatedText } = await generateText({
    model: getModel(),
    system: systemPrompt,
    prompt: text,
    temperature: 0.3,
  });

  if (!translatedText) {
    throw new Error("Empty response from AI provider");
  }

  return { translatedText };
}

/**
 * getLanguageDisplayName - Returns the display name for a given language code
 */
export function getLanguageDisplayName(langCode: string): string {
  const languageNames: Record<string, string> = {
    zh: "中文",
    "zh-CN": "中文",
    "zh-TW": "繁體中文",
    en: "English",
    ja: "日本語",
    ko: "한국어",
  };
  return languageNames[langCode] ?? langCode;
}
