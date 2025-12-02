import {
  MarkdownPlugin,
  remarkMdx,
  remarkMention,
  convertChildrenDeserialize,
  convertNodesSerialize,
  SerializeMdOptions,
} from '@platejs/markdown';
import { KEYS, NodeApi } from 'platejs';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

function getMdastText(nodes: any[] = []): string {
  return nodes
    .map((node) => {
      if (!node) return '';
      if (node.type === 'text') return node.value ?? '';
      if (node.children) return getMdastText(node.children);
      return '';
    })
    .join('');
}

function deserializeDetails(mdastNode: any, deco: any, options: any) {
  const childrenMdast: any[] = mdastNode.children ?? [];

  const summaryElementIndex = childrenMdast.findIndex(
    (child) =>
      child?.type === 'mdxJsxFlowElement' && child.name === 'DetailsSummary'
  );

  let summaryText = '';
  let remainingChildren = childrenMdast;

  if (summaryElementIndex !== -1) {
    const summaryChild = childrenMdast[summaryElementIndex];
    summaryText = getMdastText(summaryChild.children);
    remainingChildren = [
      ...childrenMdast.slice(0, summaryElementIndex),
      ...childrenMdast.slice(summaryElementIndex + 1),
    ];
  } else {
    const summaryAttr = mdastNode.attributes?.find(
      (attr: any) => attr.name === 'summary'
    );
    summaryText = summaryAttr?.value || '';
  }

  const summaryNode = {
    type: KEYS.p,
    children: summaryText ? [{ text: summaryText }] : [{ text: '' }],
  };

  const contentChildren = remainingChildren.length
    ? convertChildrenDeserialize(remainingChildren, deco, options)
    : [
        {
          type: KEYS.p,
          children: [{ text: '' }],
        },
      ];

  return {
    type: 'details',
    children: [summaryNode, ...contentChildren],
  };
}

function serializeDetails(slateNode: any, options: SerializeMdOptions) {
  const children = slateNode.children || [];
  const [summaryNode, ...contentChildren] = children;
  const summaryText = summaryNode
    ? NodeApi.string(summaryNode).replace(/\s+/g, ' ').trim()
    : '';

  const summaryChildrenMdast =
    summaryNode && Array.isArray(summaryNode.children)
      ? convertNodesSerialize(summaryNode.children, options)
      : [];

  const blockChildren =
    contentChildren.length > 0
      ? contentChildren
      : [
          {
            type: KEYS.p,
            children: [{ text: '' }],
          },
        ];

  const contentMdast = convertNodesSerialize(blockChildren, options, true);

  return {
    type: 'mdxJsxFlowElement',
    name: 'details',
    attributes: [],
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: 'summary',
        attributes: [],
        children:
          summaryChildrenMdast.length > 0
            ? summaryChildrenMdast
            : [
                {
                  type: 'text',
                  value: summaryText,
                },
              ],
      },
      ...contentMdast,
    ],
  };
}

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion, KEYS.comment],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      // 自定义转换规则:将 <Details> MDX 组件转换为 DetailsPlugin 节点
      rules: {
        Details: {
          deserialize: deserializeDetails,
        },
        details: {
          serialize: serializeDetails,
        },
      },
    },
  }),
];
