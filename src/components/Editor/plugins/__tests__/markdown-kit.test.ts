/**
 * 测试 markdown-kit.ts 的 serialize/deserialize 函数
 * 验证 Slate AST ↔ MDX 的转换
 */

import { describe, test, expect } from '@jest/globals';
import { KEYS } from 'platejs';

// 注意：这些是内部函数，实际测试时需要导出或使用集成测试
// 这里提供测试用例的结构

describe('Details 序列化/反序列化', () => {
  describe('deserializeDetails', () => {
    test('应该反序列化新格式的 MDX（使用 <summary> 标签）', () => {
      const mdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'Details',
        attributes: [],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'summary',
            attributes: [],
            children: [
              { type: 'text', value: 'Click to expand' }
            ]
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'Hidden content' }
            ]
          }
        ]
      };

      // 期望的 Slate 结构
      const expected = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Click to expand' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Hidden content' }]
          }
        ]
      };

      // 实际测试需要调用 deserializeDetails
      // const result = deserializeDetails(mdastNode, deco, options);
      // expect(result).toEqual(expected);
    });

    test('应该兼容旧格式（使用 <DetailsSummary> 标签）', () => {
      const mdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'Details',
        attributes: [
          { name: 'summary', value: 'Fallback summary' }
        ],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'DetailsSummary',
            attributes: [],
            children: [
              { type: 'text', value: 'Actual summary' }
            ]
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'Content' }
            ]
          }
        ]
      };

      // 应该优先使用 <DetailsSummary> 的内容
      const expected = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Actual summary' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content' }]
          }
        ]
      };
    });

    test('应该兼容最旧格式（只有 summary 属性）', () => {
      const mdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'Details',
        attributes: [
          { name: 'summary', value: 'Summary text' }
        ],
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'Content' }
            ]
          }
        ]
      };

      const expected = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Summary text' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content' }]
          }
        ]
      };
    });

    test('应该处理空 summary', () => {
      const mdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'Details',
        attributes: [],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'summary',
            attributes: [],
            children: []
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'Content' }
            ]
          }
        ]
      };

      const expected = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: '' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content' }]
          }
        ]
      };
    });

    test('应该处理嵌套的 details', () => {
      const mdastNode = {
        type: 'mdxJsxFlowElement',
        name: 'Details',
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'summary',
            children: [{ type: 'text', value: 'Outer' }]
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'Outer content' }]
          },
          {
            type: 'mdxJsxFlowElement',
            name: 'Details',
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'summary',
                children: [{ type: 'text', value: 'Inner' }]
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', value: 'Inner content' }]
              }
            ]
          }
        ]
      };

      // 嵌套的 details 应该被递归处理
    });
  });

  describe('serializeDetails', () => {
    test('应该序列化为标准的 mdxJsxFlowElement 结构', () => {
      const slateNode = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Summary text' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content text' }]
          }
        ]
      };

      const expected = {
        type: 'mdxJsxFlowElement',
        name: 'details',
        attributes: [],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'summary',
            attributes: [],
            children: [
              {
                type: 'text',
                value: 'Summary text'
              }
            ]
          },
          // content 部分会被 convertNodesSerialize 处理
        ]
      };

      // const result = serializeDetails(slateNode, options);
      // expect(result.name).toBe('details');
      // expect(result.children[0].name).toBe('summary');
    });

    test('应该处理空 summary', () => {
      const slateNode = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: '' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content' }]
          }
        ]
      };

      // summary 为空时应该输出空文本节点
    });

    test('应该处理嵌套的 details', () => {
      const slateNode = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Outer' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Outer content' }]
          },
          {
            type: 'details',
            children: [
              {
                type: KEYS.p,
                children: [{ text: 'Inner' }]
              },
              {
                type: KEYS.p,
                children: [{ text: 'Inner content' }]
              }
            ]
          }
        ]
      };

      // convertNodesSerialize 应该递归处理嵌套的 details
    });

    test('应该处理 summary 中的富文本', () => {
      const slateNode = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [
              { text: 'Bold ', bold: true },
              { text: 'normal' }
            ]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Content' }]
          }
        ]
      };

      // summary 中的格式应该被正确序列化
    });
  });

  describe('往返测试（roundtrip）', () => {
    test('序列化后反序列化应该得到相同的结构', () => {
      const original = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Test summary' }]
          },
          {
            type: KEYS.p,
            children: [{ text: 'Test content' }]
          }
        ]
      };

      // const serialized = serializeDetails(original, options);
      // const deserialized = deserializeDetails(serialized, deco, options);
      // expect(deserialized).toEqual(original);
    });

    test('嵌套结构的往返测试', () => {
      const original = {
        type: 'details',
        children: [
          {
            type: KEYS.p,
            children: [{ text: 'Outer' }]
          },
          {
            type: 'details',
            children: [
              {
                type: KEYS.p,
                children: [{ text: 'Inner' }]
              },
              {
                type: KEYS.p,
                children: [{ text: 'Content' }]
              }
            ]
          }
        ]
      };

      // 往返后应该保持结构不变
    });
  });
});
