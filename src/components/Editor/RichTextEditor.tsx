"use client";

import { Plate, WithPlateOptions, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { editorPlugins } from "./plugins";
import { MarkdownPlugin } from "@platejs/markdown";
import { preprocessMarkdownDetails } from "./utils/markdown-preprocessor";

interface RichTextEditorProps extends Omit<WithPlateOptions, 'plugins'> {
  /**
   * 可选的 Markdown 初始内容
   * 如果提供,会自动转换为 Plate 节点
   */
  markdown?: string;
}

export const RichTextEditor = ({ markdown, ...props }: RichTextEditorProps) => {
  const editor = usePlateEditor({
    ...props,
    plugins: editorPlugins,
    // 如果提供了 markdown,预处理后使用 deserialize 转换为节点
    value: markdown
      ? (editor) => {
          const processedMarkdown = preprocessMarkdownDetails(markdown);
          return editor.getApi(MarkdownPlugin).markdown.deserialize(processedMarkdown);
        }
      : props.value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}
