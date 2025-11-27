import { DetailsPlugin } from './plugins/details-plugin';
import { MediaKit } from './plugins/media-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { FontKit } from './plugins/font-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { BaseEditorKit } from './editor-base-kit';

export const editorPlugins = [
  ...BaseEditorKit,
  DetailsPlugin,
  ...MediaKit,
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...FontKit,
];

