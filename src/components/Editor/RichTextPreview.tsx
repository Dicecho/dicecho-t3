"use client";

import { Plate, WithPlateOptions, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";

export const RichTextPreview = (props: Omit<WithPlateOptions, 'plugins'>) => {
  const editor = usePlateEditor(props);

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}