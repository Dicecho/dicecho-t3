import { createSlateEditor, KEYS } from "platejs";
import { BaseEditorKit, LegacyBaseEditorKit } from "@/components/Editor/editor-base-kit";
import { MarkdownPlugin } from "@platejs/markdown";

/**
 * Serialize PlateJS rich text state to Markdown string.
 * 用于新格式 AST（details 的第一个 children 是 summary）
 */
export function serializeRichTextToMarkdown(richTextState: any[]): string {
  const preprocessedState = richTextState.map((node) => ({
    ...node,
    type: node.type ?? KEYS.p,
  }));

  const editor = createSlateEditor({
    plugins: [...BaseEditorKit],
  });

  return editor.getApi(MarkdownPlugin).markdown.serialize({
    value: preprocessedState,
  });
}

/**
 * Serialize legacy PlateJS rich text state to Markdown string.
 * 用于旧格式 AST（richTextState 字段）：
 * - details 的 summary 作为节点属性存在
 * - 如果没有 summary 属性，所有 children 都是 content
 */
export function serializeRichTextToMarkdownLegacy(richTextState: any[]): string {
  const preprocessedState = richTextState.map((node) => ({
    ...node,
    type: node.type ?? KEYS.p,
  }));

  const editor = createSlateEditor({
    plugins: [...LegacyBaseEditorKit],
  });

  return editor.getApi(MarkdownPlugin).markdown.serialize({
    value: preprocessedState,
  });
}
