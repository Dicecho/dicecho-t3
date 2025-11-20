import { DetailsPlugin } from './plugins/details-plugin';
import { MediaKit } from './plugins/media-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { FontKit } from './plugins/font-kit';

export const editorPlugins = [
  DetailsPlugin,
  ...MediaKit,
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...FontKit,
];

