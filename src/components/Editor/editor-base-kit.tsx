import { BaseAlignKit } from "./plugins/align-base-kit";
import { BaseBasicBlocksKit } from "./plugins/basic-blocks-base-kit";
import { BaseBasicMarksKit } from "./plugins/basic-marks-base-kit";
import { BaseCalloutKit } from "./plugins/callout-base-kit";
import { BaseCodeBlockKit } from "./plugins/code-block-base-kit";
import { BaseColumnKit } from "./plugins/column-base-kit";
import { BaseDateKit } from "./plugins/date-base-kit";
import { BaseDetailsKit } from "./plugins/details-base-kit";
import { BaseFontKit } from "./plugins/font-base-kit";
import { BaseLineHeightKit } from "./plugins/line-height-base-kit";
import { BaseLinkKit } from "./plugins/link-base-kit";
import { BaseListKit } from "./plugins/list-base-kit";
import { MarkdownKit, LegacyMarkdownKit } from "./plugins/markdown-kit";
import { BaseMathKit } from "./plugins/math-base-kit";
import { BaseMediaKit } from "./plugins/media-base-kit";
import { BaseMentionKit } from "./plugins/mention-base-kit";
import { BaseTableKit } from "./plugins/table-base-kit";
import { BaseTocKit } from "./plugins/toc-base-kit";
import { BaseToggleKit } from "./plugins/toggle-base-kit";

const basePlugins = [
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseTableKit,
  ...BaseToggleKit,
  ...BaseTocKit,
  ...BaseMediaKit,
  ...BaseCalloutKit,
  ...BaseColumnKit,
  ...BaseMathKit,
  ...BaseDateKit,
  ...BaseLinkKit,
  ...BaseMentionKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
  ...BaseDetailsKit,
];

export const BaseEditorKit = [...basePlugins, ...MarkdownKit];

/**
 * 旧格式 EditorKit
 * 用于序列化 richTextState 字段中的旧格式 AST
 */
export const LegacyBaseEditorKit = [...basePlugins, ...LegacyMarkdownKit];
