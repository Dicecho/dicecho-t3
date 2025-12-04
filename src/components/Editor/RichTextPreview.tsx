"use client";

import { Plate, WithPlateOptions, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { editorPlugins } from "./plugins";
import { MarkdownPlugin } from "@platejs/markdown";
import { preprocessMarkdown } from "./utils/markdown-preprocessor";

interface RichTextPreviewProps extends Omit<WithPlateOptions, 'plugins'> {
  /**
   * 可选的 Markdown 初始内容
   * 如果提供,会自动转换为 Plate 节点
   */
  markdown?: string;
}

export const RichTextPreview = ({ markdown, ...props }: RichTextPreviewProps) => {
  const editor = usePlateEditor({
    readOnly: true,
    ...props,
    plugins: editorPlugins,
    // 如果提供了 markdown,预处理后使用 deserialize 转换为节点
    value: markdown
      ? (editor) => {
          const processedMarkdown = preprocessMarkdown(markdown);
          return editor.getApi(MarkdownPlugin).markdown.deserialize(processedMarkdown);
        }
      : props.value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor />
      </EditorContainer>
    </Plate>
  );
}