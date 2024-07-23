import React from "react";

import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";

import { MARK_COLOR, MARK_BG_COLOR } from "@udecode/plate-font";
import { useEditorReadOnly, useEditorState } from "@udecode/plate-common";

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
              <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
                <Bold />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
                <Italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={MARK_UNDERLINE}
                tooltip="Underline (⌘+U)"
              >
                <Underline />
              </MarkToolbarButton>

              <MarkToolbarButton
                nodeType={MARK_STRIKETHROUGH}
                tooltip="Strikethrough (⌘+⇧+M)"
              >
                <Strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={MARK_CODE} tooltip="Code (⌘+E)">
                <Code />
              </MarkToolbarButton>

              <ToolbarGroup>
                <ColorDropdownMenu nodeType={MARK_COLOR} tooltip="Text Color">
                  <Brush />
                </ColorDropdownMenu>

                <ColorDropdownMenu
                  nodeType={MARK_BG_COLOR}
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
