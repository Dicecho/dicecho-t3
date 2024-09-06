"use client";

import { Plate } from "@udecode/plate-common/react";
import { Editor } from "@/components/plate-ui/editor";
import { useMyEditor } from "./plate.config";

import type { WithPlateOptions } from "@udecode/plate-common/react";

export const RichTextPreview = (props: Omit<WithPlateOptions, 'plugins'>) => {
  const editor = useMyEditor(props);

  return (
    <Plate editor={editor}>
      <Editor variant={"ghost"} readOnly />
    </Plate>
  );
};
