"use client";

import { Plate } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";


import { plugins } from "./plate.config";

import type { PlateProps } from "@udecode/plate-common";

export const RichTextEditor = (props: Omit<PlateProps, "children">) => {
  return (
    <Plate plugins={plugins} {...props}>
      <FixedToolbar className="no-scrollbar">
        <FixedToolbarButtons />
      </FixedToolbar>
      <Editor />
    </Plate>
  );
};
