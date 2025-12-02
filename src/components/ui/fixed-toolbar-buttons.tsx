"use client";

import {
  BaselineIcon,
  BoldIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";
import { DetailsToolbarButton } from "./details-toolbar-button";
import { FontColorToolbarButton } from "./font-color-toolbar-button";
import { FontSizeToolbarButton } from "./font-size-toolbar-button";
import { RedoToolbarButton, UndoToolbarButton } from "./history-toolbar-button";
import { ImportToolbarButton } from "./import-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "./indent-toolbar-button";
import { InsertToolbarButton } from "./insert-toolbar-button";
import { LineHeightToolbarButton } from "./line-height-toolbar-button";
import { LinkToolbarButton } from "./link-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { MediaToolbarButton } from "./media-toolbar-button";
import { ModeToolbarButton } from "./mode-toolbar-button";
import { MoreToolbarButton } from "./more-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          {/* <ToolbarGroup>
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup> */}

          {/* <ToolbarGroup>
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>

            <ImportToolbarButton />
          </ToolbarGroup> */}

          <ToolbarGroup>
            {/* <InsertToolbarButton /> */}
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>

            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </ToolbarGroup>

          {/* <ToolbarGroup>
            <AlignToolbarButton />

            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup> */}

          <ToolbarGroup>
            <LinkToolbarButton />
            <DetailsToolbarButton />
            <MediaToolbarButton nodeType={KEYS.img} />
            {/* <TableToolbarButton /> */}
            {/* <EmojiToolbarButton /> */}
          </ToolbarGroup>

          {/* <ToolbarGroup> */}
            {/* <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} /> */}
          {/* </ToolbarGroup> */}
        </>
      )}

      <div className="grow" />

      {/* <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton />
      </ToolbarGroup> */}

      {/* <ToolbarGroup>
        <MoreToolbarButton />
      </ToolbarGroup> */}
      <ToolbarGroup>
        <ModeToolbarButton />
      </ToolbarGroup>
    </div>
  );
}
