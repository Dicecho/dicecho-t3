import React from "react";

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";

import { FontColorPlugin, FontBackgroundColorPlugin } from "@udecode/plate-font";
import { useEditorReadOnly, useEditorState } from "@udecode/plate-common/react";

import {
  Bold,
  Italic,
  Code,
  Strikethrough,
  Underline,
  Brush,
  Paintbrush,
} from "lucide-react";

import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "@/components/plate-ui/toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { ColorDropdownMenu } from "./color-dropdown-menu";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const {} = useEditorState();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
                <Bold />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘+I)">
                <Italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={UnderlinePlugin.key}
                tooltip="Underline (⌘+U)"
              >
                <Underline />
              </MarkToolbarButton>

              <MarkToolbarButton
                nodeType={StrikethroughPlugin.key}
                tooltip="Strikethrough (⌘+⇧+M)"
              >
                <Strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
                <Code />
              </MarkToolbarButton>

              <ToolbarGroup>
                <ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip="Text Color">
                  <Brush />
                </ColorDropdownMenu>

                <ColorDropdownMenu
                  nodeType={FontBackgroundColorPlugin.key}
                  tooltip="Highlight Color"
                >
                  <Paintbrush />
                </ColorDropdownMenu>
              </ToolbarGroup>
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />

        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
