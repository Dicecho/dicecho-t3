import {
  MarkdownPlugin,
  remarkMdx,
  remarkMention,
  convertChildrenDeserialize,
} from '@platejs/markdown';
import { KEYS, NodeApi } from 'platejs';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion, KEYS.comment],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      // 自定义转换规则:将 <Details> MDX 组件转换为 DetailsPlugin 节点
      // 规则的 key 应该匹配 mdast 节点的 name 属性(对于 MDX 组件是组件名)
      rules: {
        Details: {
          deserialize: (mdastNode: any, deco: any, options: any) => {
            // 从 MDX 组件提取 summary 属性和内容
            const summaryAttr = mdastNode.attributes?.find(
              (attr: any) => attr.name === 'summary'
            );
            const summaryText = summaryAttr?.value || '';

            // 使用 convertChildrenDeserialize 将 mdast 子节点转换为 Plate 节点
            // 这会递归处理嵌套的 Details 组件
            const children = mdastNode.children
              ? convertChildrenDeserialize(mdastNode.children, deco, options)
              : [];

            const summaryNode = {
              type: KEYS.p,
              children: summaryText
                ? [{ text: summaryText }]
                : [{ text: '' }],
            };

            const contentChildren =
              children.length > 0
                ? children
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
          },
          serialize: (slateNode: any) => {
            const children = slateNode.children || [];
            const [summaryNode, ...contentChildren] = children;
            const summaryText = summaryNode
              ? NodeApi.string(summaryNode).replace(/\s+/g, ' ').trim()
              : '';

            return {
              type: 'mdxJsxFlowElement',
              name: 'Details',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'summary',
                  value: summaryText,
                },
              ],
              children:
                contentChildren.length > 0
                  ? contentChildren
                  : [
                      {
                        type: KEYS.p,
                        children: [{ text: '' }],
                      },
                    ],
            };
          },
        },
      },
    },
  }),
];
