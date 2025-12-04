"use client";

import {
  Plate,
  WithPlateOptions,
  usePlateEditor,
  PlateProps,
} from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { KEYS } from "platejs";
import { editorPlugins } from "./plugins";
import { MarkdownPlugin } from "@platejs/markdown";
import { preprocessMarkdown } from "./utils/markdown-preprocessor";
import { FixedToolbarKit } from "./plugins/fixed-toolbar-kit";

interface RichTextEditorProps extends Omit<PlateProps, "editor" | "children"> {
  options?: Omit<WithPlateOptions, "plugins">;
  /**
   * 可选的 Markdown 初始内容
   * 如果提供,会自动转换为 Plate 节点
   */
  placeholder?: string;
  markdown?: string;
  className?: string;
  onMarkdownChange?: (markdown: string) => void;
}

export const RichTextEditor = ({
  markdown,
  options,
  placeholder,
  onMarkdownChange,
  className,
  ...props
}: RichTextEditorProps) => {
  const editor = usePlateEditor({
    ...options,
    shouldNormalizeEditor: true,
    normalizeInitialValue: (ctx) => {
      if (ctx.value.length === 0) {
        ctx.editor.tf.insertNodes({
          type: KEYS.p,
          children: [{ text: '' }],
        }, { at: [0] });
      }
    },
    plugins: [...editorPlugins, ...FixedToolbarKit],
    // 如果提供了 markdown,预处理后使用 deserialize 转换为节点
    value: markdown
      ? (editor) => {
          const processedMarkdown = preprocessMarkdown(markdown);
          return editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(processedMarkdown);
        }
      : options?.value,
  });

  const onValueChange: PlateProps["onValueChange"] = ({ editor, value }) => {
    if (onMarkdownChange) {
      const serialized = editor
        .getApi(MarkdownPlugin)
        .markdown.serialize({ value });

      return onMarkdownChange(serialized);
    }

    return props.onValueChange?.({ editor, value });
  };

  return (
    <Plate editor={editor} onValueChange={onValueChange} {...props}>
      <EditorContainer>
        <Editor placeholder={placeholder} className={className} />
      </EditorContainer>
    </Plate>
  );
};
