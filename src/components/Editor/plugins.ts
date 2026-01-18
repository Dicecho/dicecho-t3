import { DetailsPlugin } from './plugins/details-plugin';
import { MediaKit } from './plugins/media-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { FontKit } from './plugins/font-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { MentionKit } from './plugins/mention-kit';

export const editorPlugins = [
  DetailsPlugin,
  ...ExitBreakKit,
  ...MediaKit,
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...FontKit,
  ...MarkdownKit,
  ...MentionKit,
];

