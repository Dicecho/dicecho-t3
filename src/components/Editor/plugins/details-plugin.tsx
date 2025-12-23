import { ElementApi, KEYS } from 'platejs';
import { toPlatePlugin } from 'platejs/react';

import { DetailsElement } from '@/components/ui/details-node';
import { BaseDetailsPlugin, isDetailsEmpty } from './details-base-plugin';

const createParagraphNode = (text = '') => ({
  type: KEYS.p,
  children: [{ text }],
});

export const DetailsPlugin = toPlatePlugin(BaseDetailsPlugin, {
  node: {
    component: DetailsElement,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (!editor.selection) return;
      if (event.defaultPrevented) return;

      const isComposing =
        'nativeEvent' in event
          ? Boolean(
              (event.nativeEvent as unknown as { isComposing?: boolean })
                ?.isComposing
            )
          : false;
      if (isComposing) return;

      const isEnter = event.key === 'Enter';

      const detailsEntry = editor.api.above({
        match: (node) => ElementApi.isElement(node) && node.type === 'details',
      });

      if (!detailsEntry) return;

      const [detailsNode, detailsPath] = detailsEntry;

      if (!event.shiftKey && !(event.metaKey || event.ctrlKey) && isEnter) {
        const blockEntry = editor.api.block();
        if (blockEntry) {
          const [, blockPath] = blockEntry;
          const isSummaryPath =
            blockPath.length === detailsPath.length + 1 &&
            blockPath.every((segment, index) => {
              if (index === blockPath.length - 1) {
                return segment === 0;
              }
              return segment === detailsPath[index];
            });

          if (isSummaryPath) {
            event.preventDefault();

            const contentPath = [...detailsPath, 1];
            const contentNode = editor.api.node({ at: contentPath });
            if (!contentNode) {
              editor.tf.insertNodes(createParagraphNode(), {
                at: contentPath,
              });
            }

            const startPoint = editor.api.start(contentPath);
            if (startPoint) {
              editor.tf.select(startPoint);
            } else {
              editor.tf.select(contentPath);
            }

            return;
          }
        }
      }

      if (event.key !== 'Backspace' && event.key !== 'Delete') return;

      if (!isDetailsEmpty(detailsNode)) return;

      event.preventDefault();
      editor.tf.removeNodes({ at: detailsPath });
      editor.tf.focus();
    },
  },
});

