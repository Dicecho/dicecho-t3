import { ElementApi, NodeApi, KEYS } from 'platejs';
import { createSlatePlugin } from 'platejs';

type DetailsElementLike = {
  children?: any[];
};

const createParagraphNode = (text = '') => ({
  type: KEYS.p,
  children: [{ text }],
});

export function isDetailsEmpty(element: DetailsElementLike | null | undefined) {
  const children = element?.children ?? [];
  if (children.length === 0) {
    return true;
  }
  const summaryNode = children[0];
  const contentNodes = children.slice(1);
  const summaryText = summaryNode ? NodeApi.string(summaryNode as any).trim() : '';
  const hasContentText = contentNodes.some(
    (node) => NodeApi.string(node as any).trim().length > 0
  );
  return summaryText.length === 0 && !hasContentText;
}

export const DETAILS_KEY = 'details';

export const BaseDetailsPlugin = createSlatePlugin({
  key: DETAILS_KEY,
  node: {
    isElement: true,
    type: 'details',
  },
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
  transforms: {
    normalizeNode(entry) {
      const [node, path] = entry;

      if (!ElementApi.isElement(node) || node.type !== 'details') {
        return normalizeNode(entry);
      }

      if (node.children.length === 0) {
        editor.tf.insertNodes(createParagraphNode(), { at: [...path, 0] });
        editor.tf.insertNodes(createParagraphNode(), { at: [...path, 1] });
        return;
      }

      if (node.children.length === 1) {
        editor.tf.insertNodes(createParagraphNode(), { at: [...path, 1] });
        return;
      }

      const summaryPath = [...path, 0];
      const summaryNode = node.children[0];

      if (!ElementApi.isElement(summaryNode) || summaryNode.type !== KEYS.p) {
        editor.tf.moveNodes({
          at: summaryPath,
          to: [...path, 1],
        });
        editor.tf.insertNodes(createParagraphNode(), { at: summaryPath });
        return;
      }

      const summaryChildren = summaryNode.children ?? [];

      const blockChildIndices = summaryChildren
        .map((child, index) =>
          ElementApi.isElement(child) && !editor.api.isInline(child as any) ? index : -1
        )
        .filter((index) => index !== -1);

      if (blockChildIndices.length > 0) {
        blockChildIndices
          .slice()
          .sort((a, b) => b - a)
          .forEach((childIndex) => {
            const childPath = [...summaryPath, childIndex];
            editor.tf.moveNodes({
              at: childPath,
              to: [...path, 1],
            });
          });

        const updatedSummaryEntry = editor.api.node({ at: summaryPath });
        const updatedSummary = updatedSummaryEntry?.[0];

        if (
          !updatedSummary ||
          !ElementApi.isElement(updatedSummary) ||
          !(updatedSummary.children ?? []).some((child) => !ElementApi.isElement(child))
        ) {
          editor.tf.insertNodes({ text: '' }, { at: [...summaryPath, 0] });
        }

        return;
      }

      const hasTextChild = summaryChildren.some((child) => !ElementApi.isElement(child));
      if (!hasTextChild) {
        editor.tf.insertNodes(
          { text: '' },
          { at: [...summaryPath, summaryChildren.length] }
        );
        return;
      }

      return normalizeNode(entry);
    },
  },
}));
