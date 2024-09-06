"use client"; 

import { Plate } from "@udecode/plate-common/react";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { useMyEditor } from "./plate.config";

import type { WithPlateOptions } from "@udecode/plate-common/react";

export const RichTextEditor = (props: Omit<WithPlateOptions, 'plugins'>) => {
  const editor = useMyEditor(props);

  return (
    <Plate editor={editor}>
      <FixedToolbar className="no-scrollbar">
        <FixedToolbarButtons />
      </FixedToolbar>
      <Editor className="min-h-24"/>
    </Plate>
  );
};
