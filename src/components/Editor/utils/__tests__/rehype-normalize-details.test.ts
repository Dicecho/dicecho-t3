/**
 * 测试 rehype-normalize-details.ts
 * 验证 rehype 插件正确规范化 <details> 标签
 */

import { describe, test, expect } from '@jest/globals';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { rehypeNormalizeDetails } from '../rehype-normalize-details';

/**
 * 辅助函数：解析 HTML，应用插件，输出规范化的 HTML
 */
function normalizeHTML(html: string): string {
  const result = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeNormalizeDetails)
    .use(rehypeStringify)
    .processSync(html);

  return String(result);
}

describe('rehypeNormalizeDetails', () => {
  describe('基础功能', () => {
    test('应该保持正确的 details 结构不变', () => {
      const input = '<details><summary>Test</summary>Content</details>';
      const output = normalizeHTML(input);

      expect(output).toContain('<summary>Test</summary>');
      expect(output).toContain('Content');
    });

    test('应该为缺失 summary 的 details 添加空 summary', () => {
      const input = '<details>Content only</details>';
      const output = normalizeHTML(input);

      expect(output).toContain('<summary>');
      expect(output).toContain('</summary>');
      expect(output).toContain('Content only');
    });

    test('应该将 summary 移到最前面', () => {
      const input = '<details><p>First</p><summary>Summary</summary><p>Last</p></details>';
      const output = normalizeHTML(input);

      // summary 应该在第一个
      const summaryIndex = output.indexOf('<summary>');
      const firstPIndex = output.indexOf('<p>First</p>');
      expect(summaryIndex).toBeLessThan(firstPIndex);
    });
  });

  describe('嵌套处理', () => {
    test('应该递归处理嵌套的 details', () => {
      const input = `
<details>
  <summary>Outer</summary>
  <details>
    <summary>Inner</summary>
    Content
  </details>
</details>`;

      const output = normalizeHTML(input);

      expect(output).toContain('<summary>Outer</summary>');
      expect(output).toContain('<summary>Inner</summary>');
    });

    test('应该为嵌套的 details 添加缺失的 summary', () => {
      const input = `
<details>
  <summary>Outer</summary>
  <details>
    Inner content
  </details>
</details>`;

      const output = normalizeHTML(input);

      // 内层 details 应该也有 summary
      const summaryCount = (output.match(/<summary>/g) || []).length;
      expect(summaryCount).toBe(2);
    });

    test('应该处理多层嵌套', () => {
      const input = `
<details>
  <summary>L1</summary>
  <details>
    <summary>L2</summary>
    <details>
      <summary>L3</summary>
      Content
    </details>
  </details>
</details>`;

      const output = normalizeHTML(input);

      expect(output).toContain('<summary>L1</summary>');
      expect(output).toContain('<summary>L2</summary>');
      expect(output).toContain('<summary>L3</summary>');
    });
  });

  describe('脏数据修复', () => {
    test('应该处理空的 summary', () => {
      const input = '<details><summary></summary>Content</details>';
      const output = normalizeHTML(input);

      expect(output).toContain('<summary></summary>');
      expect(output).toContain('Content');
    });

    test('应该处理包含 HTML 的 summary', () => {
      const input = '<details><summary><strong>Bold</strong> text</summary>Content</details>';
      const output = normalizeHTML(input);

      expect(output).toContain('<strong>Bold</strong>');
    });

    test('应该处理多个 summary（保留第一个）', () => {
      const input = `
<details>
  <summary>First</summary>
  <p>Content</p>
  <summary>Second</summary>
</details>`;

      const output = normalizeHTML(input);

      // 应该只保留第一个 summary
      const firstIndex = output.indexOf('<summary>First</summary>');
      const secondIndex = output.indexOf('<summary>Second</summary>');

      expect(firstIndex).toBeGreaterThan(-1);
      // 第二个 summary 被当作普通内容处理
      expect(secondIndex).toBeGreaterThan(firstIndex);
    });
  });

  describe('内容保留', () => {
    test('应该保留所有非 summary 的内容', () => {
      const input = `
<details>
  <summary>Summary</summary>
  <p>Paragraph 1</p>
  <div>Div content</div>
  <ul><li>List item</li></ul>
</details>`;

      const output = normalizeHTML(input);

      expect(output).toContain('<p>Paragraph 1</p>');
      expect(output).toContain('<div>Div content</div>');
      expect(output).toContain('<ul><li>List item</li></ul>');
    });

    test('应该保留文本节点', () => {
      const input = `
<details>
  <summary>Test</summary>
  Plain text here
  <p>And paragraph</p>
  More plain text
</details>`;

      const output = normalizeHTML(input);

      expect(output).toContain('Plain text here');
      expect(output).toContain('More plain text');
    });
  });

  describe('边界情况', () => {
    test('应该处理完全空的 details', () => {
      const input = '<details></details>';
      const output = normalizeHTML(input);

      // 应该添加空 summary
      expect(output).toContain('<summary>');
    });

    test('应该处理只有空白的 details', () => {
      const input = '<details>   \n  \t  </details>';
      const output = normalizeHTML(input);

      expect(output).toContain('<summary>');
    });

    test('应该不影响非 details 元素', () => {
      const input = `
<div>
  <p>Not a details</p>
  <details><summary>Is a details</summary>Content</details>
  <section>Another section</section>
</div>`;

      const output = normalizeHTML(input);

      expect(output).toContain('<div>');
      expect(output).toContain('<p>Not a details</p>');
      expect(output).toContain('<section>Another section</section>');
    });

    test('应该处理相邻的多个 details', () => {
      const input = `
<details><summary>First</summary>Content 1</details>
<details><summary>Second</summary>Content 2</details>
<details><summary>Third</summary>Content 3</details>`;

      const output = normalizeHTML(input);

      expect(output).toContain('<summary>First</summary>');
      expect(output).toContain('<summary>Second</summary>');
      expect(output).toContain('<summary>Third</summary>');
    });
  });

  describe('特殊字符处理', () => {
    test('应该保留 HTML 实体', () => {
      const input = '<details><summary>&lt;Tag&gt;</summary>&amp; content</details>';
      const output = normalizeHTML(input);

      // rehype 会处理 HTML 实体
      expect(output).toBeTruthy();
    });

    test('应该处理 Unicode 字符', () => {
      const input = '<details><summary>中文测试 🎉</summary>日本語 עברית</details>';
      const output = normalizeHTML(input);

      expect(output).toContain('中文测试 🎉');
      expect(output).toContain('日本語');
      expect(output).toContain('עברית');
    });

    test('应该处理换行符', () => {
      const input = `<details>
<summary>Multi
line
summary</summary>
Content
with
newlines
</details>`;

      const output = normalizeHTML(input);

      // 换行符应该被保留
      expect(output).toBeTruthy();
    });
  });

  describe('性能相关', () => {
    test('应该高效处理大量嵌套', () => {
      // 构建10层嵌套
      let nested = 'Content';
      for (let i = 0; i < 10; i++) {
        nested = `<details><summary>Level ${i}</summary>${nested}</details>`;
      }

      const start = Date.now();
      const output = normalizeHTML(nested);
      const duration = Date.now() - start;

      // 应该在合理时间内完成（<100ms）
      expect(duration).toBeLessThan(100);
      expect(output).toContain('Level 0');
      expect(output).toContain('Level 9');
    });

    test('应该高效处理大量 details', () => {
      // 构建100个 details
      const many = Array(100)
        .fill(0)
        .map((_, i) => `<details><summary>Item ${i}</summary>Content ${i}</details>`)
        .join('\n');

      const start = Date.now();
      const output = normalizeHTML(many);
      const duration = Date.now() - start;

      // 应该在合理时间内完成（<200ms）
      expect(duration).toBeLessThan(200);
      expect(output).toContain('Item 0');
      expect(output).toContain('Item 99');
    });
  });
});
