"use client";

import { Plate, WithPlateOptions, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { editorPlugins } from "./plugins";

export const RichTextPreview = (props: Omit<WithPlateOptions, 'plugins'>) => {
  const editor = usePlateEditor({
    readOnly: true,
    ...props,
    plugins: editorPlugins,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}