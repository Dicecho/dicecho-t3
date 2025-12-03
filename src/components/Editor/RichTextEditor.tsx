"use client";

import { Plate, WithPlateOptions, usePlateEditor, PlateProps } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { editorPlugins } from "./plugins";
import { MarkdownPlugin } from "@platejs/markdown";
import { preprocessMarkdownDetails } from "./utils/markdown-preprocessor";
import { FixedToolbarKit } from './plugins/fixed-toolbar-kit';

interface RichTextEditorProps extends Omit<PlateProps, 'editor' | 'children'> {
  options?: Omit<WithPlateOptions, 'plugins'>;
  /**
   * 可选的 Markdown 初始内容
   * 如果提供,会自动转换为 Plate 节点
   */
  markdown?: string;
  onMarkdownChange?: (markdown: string) => void;
}

export const RichTextEditor = ({ markdown, options, onMarkdownChange, ...props }: RichTextEditorProps) => {
  const editor = usePlateEditor({
    ...options,
    plugins: [...editorPlugins, ...FixedToolbarKit],
    // 如果提供了 markdown,预处理后使用 deserialize 转换为节点
    value: markdown
      ? (editor) => {
          const processedMarkdown = preprocessMarkdownDetails(markdown);
          return editor.getApi(MarkdownPlugin).markdown.deserialize(processedMarkdown);
        }
      : options?.value,
  });

  const onValueChange: PlateProps['onValueChange'] = (value) => {
    if (onMarkdownChange) {
      console.log('value', value.value);

      const serialized = editor.getApi(MarkdownPlugin).markdown.serialize(value);
      console.log('serialized', serialized);

      return onMarkdownChange(serialized);
    }

    return props.onValueChange?.(value);
  };

  return (
    <Plate editor={editor} onValueChange={onValueChange} {...props}>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}
