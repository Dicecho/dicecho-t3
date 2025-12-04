/**
 * 测试 markdown-preprocessor.ts
 * 验证 HTML <details> 到 MDX 的转换
 */

import { describe, test, expect } from '@jest/globals';
import { preprocessMarkdown } from '../markdown-preprocessor';

describe('preprocessMarkdown', () => {
  describe('基础功能', () => {
    test('应该保持 details 标签格式不变', () => {
      const input = '<details><summary>Summary</summary>Content</details>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<details>');
      expect(output).toContain('<summary>');
      expect(output).toContain('Summary');
      expect(output).toContain('</summary>');
      expect(output).toContain('Content');
      expect(output).toContain('</details>');
    });

    test('应该保留 summary 中的富文本', () => {
      const input = '<details><summary><strong>Bold</strong> Summary</summary>Content</details>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<summary>');
      expect(output).toContain('<strong>Bold</strong> Summary');
      expect(output).toContain('</summary>');
    });

    test('应该保留 summary 中的行内样式属性', () => {
      const input =
        '<details><summary><span style="background-color: #666666; color: #123456;">Title</span></summary>Content</details>';
      const output = preprocessMarkdown(input);

      expect(output).toContain(
        '<span style="background-color: #666666; color: #123456;">Title</span>'
      );
    });

    test('应该处理空 summary', () => {
      const input = '<details><summary></summary>Content</details>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<summary>');
      expect(output).toContain('</summary>');
      expect(output).toContain('Content');
    });

    test('应该处理缺失的 summary', () => {
      const input = '<details>Content without summary</details>';
      const output = preprocessMarkdown(input);

      // 应该自动添加空 summary
      expect(output).toContain('<summary>');
    });
  });

  describe('嵌套 details', () => {
    test('应该正确处理嵌套的 details', () => {
      const input = `
<details>
<summary>Outer</summary>
Outer content
<details>
<summary>Inner</summary>
Inner content
</details>
</details>`;

      const output = preprocessMarkdown(input);

      expect(output).toContain('<details>');
      expect(output).toContain('Outer');
      expect(output).toContain('Inner');
      expect(output).toContain('Inner content');
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

      const output = preprocessMarkdown(input);

      expect(output).toContain('L1');
      expect(output).toContain('L2');
      expect(output).toContain('L3');
    });
  });

  describe('脏数据处理', () => {
    test('应该处理未闭合的 details 标签', () => {
      const input = '<details><summary>Test</summary>Content';
      const output = preprocessMarkdown(input);

      // 应该能处理并输出有效的 MDX
      expect(output).toBeTruthy();
      expect(output.length).toBeGreaterThan(0);
    });

    test('应该处理未闭合的 summary 标签', () => {
      const input = '<details><summary>Test Content</details>';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
    });

    test('应该处理包含普通文本的 details', () => {
      const input = 'Text <details> more text </details> end';
      const output = preprocessMarkdown(input);

      // 应该正常处理（这是一个有效的 details 块）
      expect(output).toContain('<details>');
      expect(output).toContain('more text');
      expect(output).toContain('</details>');
      expect(output).toContain('Text');
      expect(output).toContain('end');
    });
  });

  describe('混合内容', () => {
    test('应该处理 markdown 和 HTML 混合的内容', () => {
      const input = `
# Title

Some text

<details>
<summary>Expand me</summary>

**Bold text** in details

- List item 1
- List item 2

</details>

More text`;

      const output = preprocessMarkdown(input);

      expect(output).toContain('# Title');
      expect(output).toContain('<details>');
      expect(output).toContain('**Bold text**');
      expect(output).toContain('More text');
    });

    test('应该保留非 details 的 HTML', () => {
      const input = '<div>Test</div><details><summary>S</summary>C</details><p>End</p>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<div>Test</div>');
      expect(output).toContain('<p>End</p>');
      expect(output).toContain('<details>');
    });
  });

  describe('边界情况', () => {
    test('应该处理空字符串', () => {
      expect(preprocessMarkdown('')).toBe('');
    });

    test('应该处理不包含 details 的文本', () => {
      const input = 'Just plain text';
      expect(preprocessMarkdown(input)).toBe(input);
    });

    test('应该处理只有空白的 details', () => {
      const input = '<details><summary></summary></details>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<details>');
    });

    test('应该处理大小写混合的标签', () => {
      const input = '<DETAILS><SUMMARY>Test</SUMMARY>Content</DETAILS>';
      const output = preprocessMarkdown(input);

      expect(output).toContain('<details>');
      expect(output).toContain('<summary>');
      expect(output).toContain('Test');
      expect(output).toContain('</summary>');
    });
  });

  describe('修复其他未闭合的 HTML 标签', () => {
    test('应该修复未闭合的 <div> 标签', () => {
      const input = '<div>This is unclosed div Content after';
      const output = preprocessMarkdown(input);

      // rehype 会自动闭合 div
      expect(output).toBeTruthy();
      expect(output.length).toBeGreaterThan(0);
      expect(output).toContain('This is unclosed div');
      expect(output).toContain('Content after');
    });

    test('应该修复未闭合的 <span> 标签', () => {
      const input = 'Start <span>unclosed span End';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Start');
      expect(output).toContain('unclosed span');
      expect(output).toContain('End');
    });

    test('应该修复未闭合的 <p> 标签', () => {
      const input = '<p>Paragraph without closing tag Another paragraph';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Paragraph without closing tag');
      expect(output).toContain('Another paragraph');
    });

    test('应该修复多个未闭合的标签', () => {
      const input = '<div>Outer <span>Inner <p>Deepest Content';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Outer');
      expect(output).toContain('Inner');
      expect(output).toContain('Deepest');
      expect(output).toContain('Content');
    });

    test('应该修复未闭合的 <strong> 和 <em> 标签', () => {
      const input = 'Text <strong>bold <em>italic and bold';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Text');
      expect(output).toContain('bold');
      expect(output).toContain('italic and bold');
    });

    test('应该修复混合了 details 和其他未闭合标签', () => {
      const input = '<div>Container <details><summary>Test</summary>Content More text';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('<details>');
      expect(output).toContain('Container');
      expect(output).toContain('More text');
    });

    test('应该修复未闭合的 <ul> 和 <li> 标签', () => {
      const input = '<ul><li>Item 1<li>Item 2 Text after';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Item 1');
      expect(output).toContain('Item 2');
      expect(output).toContain('Text after');
    });

    test('应该处理自闭合标签如 <img> <br> <hr>', () => {
      const input = 'Text <img src="test.jpg"> <br> <hr> More text';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Text');
      expect(output).toContain('More text');
    });

    test('应该修复未闭合的 <a> 标签', () => {
      const input = '<a href="https://example.com">Link text Some other content';
      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('Link text');
      expect(output).toContain('Some other content');
    });

    test('应该处理复杂的嵌套和未闭合标签混合', () => {
      const input = `
<div class="container">
  <p>First paragraph
  <div>Nested div
    <span>Unclosed span
      <details>
        <summary>Summary
        Content
      </details>
    <p>Another paragraph
</div>
Final text`;

      const output = preprocessMarkdown(input);

      expect(output).toBeTruthy();
      expect(output).toContain('First paragraph');
      expect(output).toContain('Nested div');
      expect(output).toContain('Unclosed span');
      expect(output).toContain('<details>');
      expect(output).toContain('Another paragraph');
      expect(output).toContain('Final text');
    });
  });

  describe('真实用户数据处理', () => {
    test('应该处理单行的长 details', () => {
      const randomSummary = Math.random().toString(36).substring(2, 15);
      const randomContent = Math.random().toString(36).substring(2, 15);
      // 这是真实用户输入的格式：整个 details 在一行，长度 >160 字符
      const input = `<details><summary>${randomSummary}</summary>${randomContent}</details>`;
      const output = preprocessMarkdown(input);

      // 应该被分成多行
      expect(output).toContain('<details>');
      expect(output).toContain('<summary>');
      expect(output).toContain('</summary>');
      expect(output).toContain('</details>');

      // summary 和 content 应该分开
      const lines = output.split('\n');
      const summaryLineIndex = lines.findIndex(line => line.trim() === '<summary>');
      const summaryEndIndex = lines.findIndex(line => line.trim() === '</summary>');

      expect(summaryLineIndex).toBeGreaterThan(-1);
      expect(summaryEndIndex).toBeGreaterThan(summaryLineIndex);

      // summary 内容应该独占一行
      const summaryContent = lines[summaryLineIndex + 1]?.trim();
      expect(summaryContent).toBe(randomSummary);
    });

    test('应该处理完整的真实评论数据', () => {

      const randomText = Math.random().toString(36).substring(2, 15);
      const randomContent = Math.random().toString(36).substring(2, 15);
      const randomSummary = Math.random().toString(36).substring(2, 15);
      const realData = `${randomText}
<details><summary>${randomSummary}</summary>${randomContent}</details>
`;

      const output = preprocessMarkdown(realData);

      // 应该保留前面的文本
      expect(output).toContain(randomText);

      // details 应该被正确处理
      expect(output).toContain('<details>');
      expect(output).toContain('<summary>');
      expect(output).toContain(randomSummary);
      expect(output).toContain(randomContent);
      expect(output).toContain('</details>');

      // 验证格式化后的结构
      const detailsStart = output.indexOf('<details>');
      const detailsEnd = output.indexOf('</details>') + '</details>'.length;
      const detailsBlock = output.slice(detailsStart, detailsEnd);
      const lines = detailsBlock.split('\n');

      // 应该有多行（不是单行）
      expect(lines.length).toBeGreaterThan(5);
    });

    test('应该处理包含多种复杂情况的线上真实脏数据', () => {
      // 这是生产环境的真实数据，包含：
      // - 嵌套的 details
      // - 未闭合的 details 标签
      // - summary 中包含删除线等富文本
      // - details 中包含图片、代码块等复杂内容
      const realDirtyData = `~~***嵌套格式***~~

~~删除线~~

**加粗** *斜*

# 标题1

## 标题2

### 标题3

#### 标题4

##### 标题5

###### 标题6

[link](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)

<details><summary>~~summarycontent~~</summary>...</details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)

<details><summary>inner image</summary>![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)</details>

<details><summary>summarycontent</summary><details><summary>summarycontent</summary>detailscontent<details><summary>summarycontent</summary>inner inner</details></details></details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09

<details><summary>

<233

\`\`\`java
hello?world
![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09
\`\`\`

`;

      // 不应该抛出错误
      expect(() => {
        const output = preprocessMarkdown(realDirtyData);

        // 验证基本结构被保留
        expect(output).toBeTruthy();
        expect(output.length).toBeGreaterThan(0);

        // 应该包含正常的 details 块
        expect(output).toContain('<details>');

        // 应该保留其他 markdown 内容
        expect(output).toContain('# 标题1');
        expect(output).toContain('**加粗**');

        // 应该处理嵌套的 details
        expect(output).toContain('inner inner');

      }).not.toThrow();
    });
  });
})
