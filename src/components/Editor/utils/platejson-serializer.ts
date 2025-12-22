import { createSlateEditor, KEYS } from "platejs";
import { BaseEditorKit } from "@/components/Editor/editor-base-kit";
import { MarkdownPlugin } from "@platejs/markdown";

/**
 * Serialize PlateJS rich text state to Markdown string.
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
