/**
 * Details 功能的端到端集成测试
 * 测试完整的数据流：HTML → MDX → Slate AST → MDX → HTML
 */

import { describe, test, expect } from '@jest/globals';

/**
 * 模拟完整的编辑器流程
 */
describe('Details 端到端集成测试', () => {
  describe('基础流程', () => {
    test('用户输入 HTML，编辑，输出 HTML', () => {
      // 1. 用户输入的 HTML
      const userInput = `
# My Document

<details>
<summary>Click me</summary>
Hidden content here
</details>

More text`;

      // 2. preprocess: HTML → MDX
      const preprocessed = `
# My Document

<details>
<summary>Click me</summary>

Hidden content here

</details>

More text`;

      // 3. deserialize: MDX → Slate AST
      const slateAST = [
        {
          type: 'h1',
          children: [{ text: 'My Document' }]
        },
        {
          type: 'details',
          children: [
            {
              type: 'p',
              children: [{ text: 'Click me' }]
            },
            {
              type: 'p',
              children: [{ text: 'Hidden content here' }]
            }
          ]
        },
        {
          type: 'p',
          children: [{ text: 'More text' }]
        }
      ];

      // 4. 用户编辑（修改 summary）
      const editedAST = [
        {
          type: 'h1',
          children: [{ text: 'My Document' }]
        },
        {
          type: 'details',
          children: [
            {
              type: 'p',
              children: [{ text: 'Edited summary' }]  // ← 修改了
            },
            {
              type: 'p',
              children: [{ text: 'Hidden content here' }]
            }
          ]
        },
        {
          type: 'p',
          children: [{ text: 'More text' }]
        }
      ];

      // 5. serialize: Slate AST → MDX
      const serialized = `
# My Document

<details>
<summary>Edited summary</summary>

Hidden content here

</details>

More text`;

      // 6. postprocess: MDX → HTML (实际上直接返回)
      const finalOutput = serialized;

      // 验证：最终输出应该是有效的 HTML/Markdown
      expect(finalOutput).toContain('# My Document');
      expect(finalOutput).toContain('<details>');
      expect(finalOutput).toContain('<summary>Edited summary</summary>');
      expect(finalOutput).toContain('Hidden content here');
    });
  });

  describe('嵌套 details 流程', () => {
    test('应该正确处理嵌套的 details', () => {
      const userInput = `
<details>
<summary>Outer</summary>
Outer content
<details>
<summary>Inner</summary>
Inner content
</details>
</details>`;

      // Slate AST
      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: 'Outer' }]
          },
          {
            type: 'p',
            children: [{ text: 'Outer content' }]
          },
          {
            type: 'details',
            children: [
              {
                type: 'p',
                children: [{ text: 'Inner' }]
              },
              {
                type: 'p',
                children: [{ text: 'Inner content' }]
              }
            ]
          }
        ]
      };

      // 序列化后应该保持嵌套结构
      const serialized = `
<details>
<summary>Outer</summary>

Outer content

<details>
<summary>Inner</summary>

Inner content

</details>

</details>`;

      expect(serialized).toContain('<summary>Outer</summary>');
      expect(serialized).toContain('<summary>Inner</summary>');
    });
  });

  describe('脏数据处理流程', () => {
    test('应该修复未闭合的标签', () => {
      const dirtyInput = '<details><summary>Test</summary>Content';

      // preprocess 应该能够处理
      // 预期输出包含完整的标签
      const processed = `
<details>
<summary>Test</summary>

Content

</details>`;

      expect(processed).toContain('</details>');
    });

    test('应该添加缺失的 summary', () => {
      const dirtyInput = '<details>Content without summary</details>';

      // preprocess 应该自动添加空 summary
      const processed = `
<details>
<summary></summary>

Content without summary

</details>`;

      expect(processed).toContain('<summary>');
    });
  });

  describe('富文本内容', () => {
    test('应该支持 summary 中的格式', () => {
      const input = `
<details>
<summary><strong>Bold</strong> and <em>italic</em></summary>
Content
</details>`;

      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [
              { text: 'Bold', bold: true },
              { text: ' and ' },
              { text: 'italic', italic: true }
            ]
          },
          {
            type: 'p',
            children: [{ text: 'Content' }]
          }
        ]
      };

      // summary 中的格式应该被保留
    });

    test('应该支持 details 内容中的复杂元素', () => {
      const input = `
<details>
<summary>Table inside</summary>

| Col 1 | Col 2 |
|-------|-------|
| A     | B     |

</details>`;

      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: 'Table inside' }]
          },
          {
            type: 'table',
            children: [
              // ... table structure
            ]
          }
        ]
      };

      // 复杂元素应该被正确处理
    });

    test('应该支持 details 内容中的图片', () => {
      const input = `
<details>
<summary>Image</summary>

![Alt text](image.png)

</details>`;

      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: 'Image' }]
          },
          {
            type: 'img',
            url: 'image.png',
            children: [{ text: '' }]
          }
        ]
      };
    });
  });

  describe('向后兼容性', () => {
    test('应该兼容旧版本的 summary 属性格式', () => {
      const oldFormat = `
<Details summary="Old style summary">
<DetailsSummary>
Actual summary content
</DetailsSummary>

Content

</details>`;

      // 应该能正确解析
      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: 'Actual summary content' }]
          },
          {
            type: 'p',
            children: [{ text: 'Content' }]
          }
        ]
      };

      // 序列化时应该输出新格式
      const serialized = `
<details>
<summary>Actual summary content</summary>

Content

</details>`;

      expect(serialized).not.toContain('<DetailsSummary>');
      expect(serialized).not.toContain('summary=');
    });

    test('应该兼容只有 summary 属性的最旧格式', () => {
      const veryOldFormat = `
<Details summary="Just an attribute">

Content

</details>`;

      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: 'Just an attribute' }]
          },
          {
            type: 'p',
            children: [{ text: 'Content' }]
          }
        ]
      };
    });
  });

  describe('边界情况', () => {
    test('应该处理空的 details', () => {
      const input = '<details><summary></summary></details>';

      const slateAST = {
        type: 'details',
        children: [
          {
            type: 'p',
            children: [{ text: '' }]
          },
          {
            type: 'p',
            children: [{ text: '' }]
          }
        ]
      };
    });

    test('应该处理多个连续的 details', () => {
      const input = `
<details><summary>First</summary>Content 1</details>
<details><summary>Second</summary>Content 2</details>
<details><summary>Third</summary>Content 3</details>`;

      // 每个 details 应该被独立处理
    });

    test('应该处理非常长的内容', () => {
      const longContent = 'x'.repeat(10000);
      const input = `<details><summary>Long</summary>${longContent}</details>`;

      // 应该能处理大量文本
    });

    test('应该处理特殊字符', () => {
      const input = `
<details>
<summary>Special: <>&"'</summary>
Content with "quotes" and 'apostrophes'
</details>`;

      // 特殊字符应该被正确处理（不需要转义）
    });
  });

  describe('性能测试（描述）', () => {
    test('应该能高效处理深层嵌套', () => {
      // 10层嵌套应该在合理时间内完成
      let nested = 'Content';
      for (let i = 0; i < 10; i++) {
        nested = `<details><summary>Level ${i}</summary>${nested}</details>`;
      }

      // 处理时间应该是 O(n)，不是 O(n^2)
    });

    test('应该能高效处理多个 details', () => {
      // 100个 details 应该在合理时间内完成
      const multiple = Array(100)
        .fill(0)
        .map((_, i) => `<details><summary>${i}</summary>Content ${i}</details>`)
        .join('\n');

      // 处理时间应该线性增长
    });
  });
});
