"use client";

import { Plate } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { plugins } from './plate.config'

import type { PlateProps } from "@udecode/plate-common";

export const RichTextPreview = (props: Omit<PlateProps, "children">) => {
  return (
    <Plate plugins={plugins} {...props}>
      <Editor variant={"ghost"} readOnly />
    </Plate>
  );
};
