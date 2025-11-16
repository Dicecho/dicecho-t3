"use client";

import { Plate, WithPlateOptions, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { editorPlugins } from "./plugins";

export const RichTextEditor = (props: Omit<WithPlateOptions, 'plugins'>) => {
  const editor = usePlateEditor({
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
