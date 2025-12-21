/**
 * AI Service - Unified interface for AI-related functionality
 *
 * Design principles:
 * 1. Simple and direct - one function per feature
 * 2. Pluggable providers - switch between AI services via configuration
 * 3. Type-safe - full TypeScript type support
 */

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
// AI Provider Interface
// ============================================

export interface AIProvider {
  translate(options: TranslateOptions): Promise<TranslateResult>;
}

// ============================================
// OpenAI Provider Implementation
// ============================================

const createOpenAIProvider = (): AIProvider => {
  const apiKey = env.OPENAI_API_KEY;
  const baseUrl = env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return {
    async translate({ text, targetLanguage, sourceLanguage }: TranslateOptions): Promise<TranslateResult> {
      const systemPrompt = `You are a professional translator. Translate the following text to ${targetLanguage}. 
Only output the translated text, nothing else. Preserve the original formatting and tone.
${sourceLanguage ? `The source language is ${sourceLanguage}.` : "Detect the source language automatically."}`;

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const translatedText = data.choices[0]?.message?.content?.trim();
      if (!translatedText) {
        throw new Error("Empty response from OpenAI");
      }

      return { translatedText };
    },
  };
};

// ============================================
// Azure OpenAI Provider Implementation
// ============================================

const createAzureOpenAIProvider = (): AIProvider => {
  const apiKey = env.AZURE_OPENAI_API_KEY;
  const endpoint = env.AZURE_OPENAI_ENDPOINT;
  const deployment = env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = env.AZURE_OPENAI_API_VERSION ?? "2024-02-01";

  if (!apiKey) {
    throw new Error("AZURE_OPENAI_API_KEY is not configured");
  }
  if (!endpoint) {
    throw new Error("AZURE_OPENAI_ENDPOINT is not configured");
  }
  if (!deployment) {
    throw new Error("AZURE_OPENAI_DEPLOYMENT is not configured");
  }

  return {
    async translate({ text, targetLanguage, sourceLanguage }: TranslateOptions): Promise<TranslateResult> {
      const systemPrompt = `You are a professional translator. Translate the following text to ${targetLanguage}. 
Only output the translated text, nothing else. Preserve the original formatting and tone.
${sourceLanguage ? `The source language is ${sourceLanguage}.` : "Detect the source language automatically."}`;

      const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Azure OpenAI API error: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const translatedText = data.choices[0]?.message?.content?.trim();
      if (!translatedText) {
        throw new Error("Empty response from Azure OpenAI");
      }

      return { translatedText };
    },
  };
};

// ============================================
// AI Service Singleton
// ============================================

let aiProvider: AIProvider | null = null;

const getAIProvider = (): AIProvider => {
  if (!aiProvider) {
    const provider = env.AI_PROVIDER ?? "openai";
    
    switch (provider) {
      case "azure":
        aiProvider = createAzureOpenAIProvider();
        break;
      case "openai":
      default:
        aiProvider = createOpenAIProvider();
        break;
    }
  }
  return aiProvider;
};

// ============================================
// Public API
// ============================================

/**
 * translate - Translates text to the specified target language
 */
export async function translate(options: TranslateOptions): Promise<TranslateResult> {
  const provider = getAIProvider();
  return provider.translate(options);
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
