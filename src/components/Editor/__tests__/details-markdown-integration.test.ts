// @ts-nocheck
/**
 * Details Markdown 集成测试
 * 测试完整的 Markdown ↔ Slate AST 转换流程
 * 使用真实的 MarkdownPlugin 和 markdown-kit
 */

import { describe, test, expect } from '@jest/globals';
import { createPlateEditor } from 'platejs/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { KEYS } from 'platejs';
import { MarkdownKit } from '../plugins/markdown-kit';
import { DetailsPlugin } from '../plugins/details-plugin';
import { LegacyMarkdownKit } from '../plugins/markdown-kit';
import { preprocessMarkdown } from '../utils/markdown-preprocessor';

/**
 * 创建测试用的编辑器实例
 */
function createTestEditor() {
  return createPlateEditor({
    plugins: [
      ...MarkdownKit,
      DetailsPlugin,
    ],
  });
}

function createLegacyTestEditor() {
  return createPlateEditor({
    plugins: [
      ...LegacyMarkdownKit,
      DetailsPlugin,
    ],
  });
}

describe('Details Markdown 完整转换测试', () => {
  describe("serialize style marks", () => {
    const editor = createTestEditor();
    const value = [
      {
        type: KEYS.p,
        children: [
          { text: '多', color: '#FE0000', backgroundColor: '#93C47D' },
          { text: '样', color: '#FFD966', backgroundColor: '#93C47D' },
          { text: '式', color: '#FE0000', backgroundColor: '#CC0000' },
        ],
      },
    ];
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value });
    expect(markdown).toContain('color: #FE0000');
    expect(markdown).toContain('background-color: #93C47D');
    expect(markdown).toContain('color: #FFD966');
    expect(markdown).toContain('background-color: #93C47D');
    expect(markdown).toContain('color: #FE0000');
    expect(markdown).toContain('background-color: #CC0000');
  })

  describe("serialize summary when summary is an attribute of details", () => {
    const editor = createLegacyTestEditor();
    const value = [
      {
        type: 'details',
        summary: "this is summary",
        children: [
          { text: 'this is children' },
        ],
      },
    ];
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value });

    // 1. "this is summary" 在 <summary></summary> 中间
    expect(markdown).toMatch(/<summary>[\s\S]*this is summary[\s\S]*<\/summary>/);

    // 2. "this is children" 不在 <summary></summary> 中间
    const summaryMatch = markdown.match(/<summary>([\s\S]*?)<\/summary>/);
    expect(summaryMatch).toBeTruthy();
    expect(summaryMatch![1]).not.toContain('this is children');

    // 3. "this is children" 在 <details></details> 中间
    expect(markdown).toMatch(/<details>[\s\S]*this is children[\s\S]*<\/details>/);
  })

  describe("旧格式 details 没有 summary 属性时，所有 children 都是 content", () => {
    test("单个 children 应该作为 content，summary 为空", () => {
      const editor = createLegacyTestEditor();
      // 线上真实脏数据：没有 summary 属性，只有一个 children
      const value = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [{ text: '拿了秘密就散桌的ho3。' }],
            },
          ],
        },
      ];
      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value });

      // 1. summary 应该为空
      expect(markdown).toMatch(/<summary>\s*<\/summary>/);

      // 2. 用户内容不应该在 summary 中
      const summaryMatch = markdown.match(/<summary>([\s\S]*?)<\/summary>/);
      expect(summaryMatch).toBeTruthy();
      expect(summaryMatch![1]).not.toContain('拿了秘密就散桌的ho3');

      // 3. 用户内容应该在 details 中（作为 content）
      expect(markdown).toContain('拿了秘密就散桌的ho3');
    });

    test("多个 children 都应该作为 content，summary 为空", () => {
      const editor = createLegacyTestEditor();
      // 多个 children 的情况
      const value = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [{ text: '第一段内容' }],
            },
            {
              type: KEYS.p,
              children: [{ text: '第二段内容' }],
            },
          ],
        },
      ];
      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value });

      // 1. summary 应该为空
      expect(markdown).toMatch(/<summary>\s*<\/summary>/);

      // 2. 所有内容都不应该在 summary 中
      const summaryMatch = markdown.match(/<summary>([\s\S]*?)<\/summary>/);
      expect(summaryMatch).toBeTruthy();
      expect(summaryMatch![1]).not.toContain('第一段内容');
      expect(summaryMatch![1]).not.toContain('第二段内容');

      // 3. 所有内容都应该在 details 中
      expect(markdown).toContain('第一段内容');
      expect(markdown).toContain('第二段内容');
    });

    test("完整的线上真实数据场景", () => {
      const editor = createLegacyTestEditor();
      // 用户提供的完整线上数据
      const value = [
        { children: [{ text: "我是" }] },
        {
          type: "details",
          children: [
            {
              type: "p",
              children: [{ text: "拿了秘密就散桌的ho3。" }],
              id: 1765781017916
            }
          ],
          id: 1765781033417
        },
        {
          type: "p",
          children: [
            { text: "说到这里我的幸运已经体现得淋漓尽致了。奈何我最终没忍住还是读了这个模组，卧槽这是什么。。。" }
          ],
          id: 1765781033419
        },
        {
          type: "details",
          children: [
            {
              type: "p",
              children: [
                { text: "我个人对必死ho的看法是这个位置某种程度上可以最好地表达pc的生死观，但是拜昆仑完全没有给这种生死观的探讨留余地，因为你猫根本不在乎你的生死观是啥他只会捕获关键词。你说你愿意死他就一脸欣慰地看着你，你说你不想死他就一脸失望地看着你然后一巴掌打晕！" }
              ],
              id: 1765781147243
            }
          ],
          id: 1765781118903
        },
      ];
      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value });

      // 1. 两个 details 的 summary 都应该为空
      const summaryMatches = markdown.match(/<summary>([\s\S]*?)<\/summary>/g);
      expect(summaryMatches).toBeTruthy();
      expect(summaryMatches!.length).toBe(2);
      summaryMatches!.forEach((match) => {
        // summary 内容应该为空（只有空白字符）
        const content = match.replace(/<\/?summary>/g, '').trim();
        expect(content).toBe('');
      });

      // 2. 用户的实际内容应该在 details 的 content 区域
      expect(markdown).toContain('拿了秘密就散桌的ho3');
      expect(markdown).toContain('我个人对必死ho的看法');
    });
  })

  describe('Markdown → Slate AST (deserialize)', () => {
    test('应该正确反序列化简单的 details', () => {
      const editor = createTestEditor();
      const markdown = `
<details>
<summary>Click to expand</summary>

Hidden content here

</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      // 验证结构
      expect(result).toHaveLength(1);
      const detailsNode = result[0];

      expect(detailsNode.type).toBe('details');
      expect(detailsNode.children).toBeDefined();
      expect(detailsNode.children.length).toBeGreaterThanOrEqual(2);

      // 第一个子节点应该是 summary (paragraph)
      const summaryNode = detailsNode.children[0];
      expect(summaryNode.type).toBe(KEYS.p);
      expect(summaryNode.children[0].text).toBe('Click to expand');

      // 后续节点是内容
      const contentNode = detailsNode.children[1];
      expect(contentNode.type).toBe(KEYS.p);
      expect(contentNode.children[0].text).toContain('Hidden content');
    });

    test('应该正确处理嵌套的 details', () => {
      const editor = createTestEditor();
      const markdown = `
<details>
<summary>Outer</summary>

Outer content

<details>
<summary>Inner</summary>

Inner content

</details>

</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      expect(result).toHaveLength(1);
      const outerDetails = result[0];

      expect(outerDetails.type).toBe('details');
      expect(outerDetails.children[0].children[0].text).toBe('Outer');

      // 查找嵌套的 details
      const innerDetails = outerDetails.children.find((child: any) => child.type === 'details');
      expect(innerDetails).toBeDefined();
      expect(innerDetails.children[0].children[0].text).toBe('Inner');
    });

    test('应该支持 summary 中的富文本', () => {
      const editor = createTestEditor();
      const markdown = `
<details>
<summary>**Bold** and *italic*</summary>

Content

</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      const detailsNode = result[0];
      const summaryNode = detailsNode.children[0];

      // summary 应该包含格式化的文本节点
      expect(summaryNode.children.length).toBeGreaterThan(1);

      // 检查是否有 bold 节点
      const hasBold = summaryNode.children.some((child: any) => child.bold === true);
      expect(hasBold).toBe(true);
    });

    test('应该向后兼容旧的 <Details> 大写格式', () => {
      const editor = createTestEditor();
      const markdown = `
<Details>
<summary>Old format</summary>

Content

</Details>
`;

      // preprocessMarkdown 会将大写的 Details 转换为小写
      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      expect(result).toHaveLength(1);
      const detailsNode = result[0];

      expect(detailsNode.type).toBe('details');
      expect(detailsNode.children[0].children[0].text).toBe('Old format');
    });

    test('应该兼容只有 summary 属性的最旧格式', () => {
      const editor = createTestEditor();
      const markdown = `
<Details summary="Just attribute">

Content

</Details>
`;

      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(markdown);

      const detailsNode = result[0];
      const summaryNode = detailsNode.children[0];

      expect(summaryNode.children[0].text).toBe('Just attribute');
    });
  });

  describe('Slate AST → Markdown (serialize)', () => {
    test('应该正确序列化简单的 details 节点', () => {
      const editor = createTestEditor();

      const slateValue = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [{ text: 'My summary' }],
            },
            {
              type: KEYS.p,
              children: [{ text: 'My content' }],
            },
          ],
        },
      ];

      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });

      // 验证输出格式
      expect(markdown).toContain('<details>');
      expect(markdown).toMatch(/<summary>\s*My summary\s*<\/summary>/);
      expect(markdown).toContain('My content');
      expect(markdown).toContain('</details>');

      // 确保不包含旧格式的标签
      expect(markdown).not.toContain('<Details>');
      expect(markdown).not.toContain('<DetailsSummary>');
      expect(markdown).not.toContain('summary=');
    });

    test('应该正确序列化嵌套的 details', () => {
      const editor = createTestEditor();

      const slateValue = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [{ text: 'Outer' }],
            },
            {
              type: KEYS.p,
              children: [{ text: 'Outer content' }],
            },
            {
              type: 'details',
              children: [
                {
                  type: KEYS.p,
                  children: [{ text: 'Inner' }],
                },
                {
                  type: KEYS.p,
                  children: [{ text: 'Inner content' }],
                },
              ],
            },
          ],
        },
      ];

      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });

      // 验证嵌套结构
      const outerStart = markdown.indexOf('Outer');
      const innerStart = markdown.indexOf('Inner');
      const outerEnd = markdown.lastIndexOf('</details>');

      expect(outerStart).toBeGreaterThan(-1);
      expect(innerStart).toBeGreaterThan(outerStart);
      expect(outerEnd).toBeGreaterThan(innerStart);
    });

    test('应该处理空的 summary', () => {
      const editor = createTestEditor();

      const slateValue = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [{ text: '' }],
            },
            {
              type: KEYS.p,
              children: [{ text: 'Content only' }],
            },
          ],
        },
      ];

      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });

      expect(markdown).toMatch(/<summary>\s*<\/summary>/);
      expect(markdown).toContain('Content only');
    });

    test('应该保留 summary 中的富文本格式', () => {
      const editor = createTestEditor();

      const slateValue = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [
                { text: 'Bold ', bold: true },
                { text: 'and ' },
                { text: 'italic', italic: true },
              ],
            },
            {
              type: KEYS.p,
              children: [{ text: 'Content' }],
            },
          ],
        },
      ];

      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });

      // 应该包含 markdown 格式
      expect(markdown).toMatch(/\*\*Bold\*\*/);  // Bold
      expect(markdown).toMatch(/_italic_/);    // Italic
    });
  });

  describe('往返测试 (Roundtrip)', () => {
    test('简单 details 往返应该保持一致', () => {
      const editor = createTestEditor();

      const originalMarkdown = `
<details>
<summary>Test summary</summary>

Test content

</details>
`;

      // Markdown → Slate
      const processed = preprocessMarkdown(originalMarkdown);
      const slateValue = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      // Slate → Markdown
      const outputMarkdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });

      // 再次反序列化
      const slateValue2 = editor.getApi(MarkdownPlugin).markdown.deserialize(outputMarkdown);

      // 两次的 Slate AST 应该相同
      expect(slateValue2[0].type).toBe(slateValue[0].type);
      expect(slateValue2[0].children[0].children[0].text).toBe(
        slateValue[0].children[0].children[0].text
      );
    });

    test('嵌套 details 往返应该保持结构', () => {
      const editor = createTestEditor();

      const originalMarkdown = `
<details>
<summary>Outer</summary>

Outer content

<details>
<summary>Inner</summary>

Inner content

</details>

</details>
`;

      const processed = preprocessMarkdown(originalMarkdown);
      const slateValue1 = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);
      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue1 });
      const slateValue2 = editor.getApi(MarkdownPlugin).markdown.deserialize(markdown);

      // 验证嵌套结构保持
      expect(slateValue2[0].type).toBe('details');
      const innerDetails = slateValue2[0].children.find((child: any) => child.type === 'details');
      expect(innerDetails).toBeDefined();
    });

    test('富文本格式往返应该保持', () => {
      const editor = createTestEditor();

      const slateValue = [
        {
          type: 'details',
          children: [
            {
              type: KEYS.p,
              children: [
                { text: 'Bold', bold: true },
                { text: ' and ' },
                { text: 'italic', italic: true },
              ],
            },
            {
              type: KEYS.p,
              children: [{ text: 'Content' }],
            },
          ],
        },
      ];

      // Slate → Markdown → Slate
      const markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateValue });
      const slateValue2 = editor.getApi(MarkdownPlugin).markdown.deserialize(markdown);

      const summaryNode = slateValue2[0].children[0];

      // 检查格式是否保留
      const hasBold = summaryNode.children.some((child: any) => child.bold === true);
      const hasItalic = summaryNode.children.some((child: any) => child.italic === true);

      expect(hasBold).toBe(true);
      expect(hasItalic).toBe(true);
    });
  });

  describe('与其他 Markdown 元素混合', () => {
    test('应该正确处理 details 与标题、段落的混合', () => {
      const editor = createTestEditor();

      const markdown = `
# Main Title

Some intro text

<details>
<summary>Collapsible section</summary>

Hidden text

</details>

Conclusion text
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      // 应该包含多种类型的节点
      const types = result.map((node: any) => node.type);

      expect(types).toContain('h1');
      expect(types).toContain('details');
      expect(types).toContain(KEYS.p);
    });

    test('应该在 details 中支持复杂的 Markdown', () => {
      const editor = createTestEditor();

      const markdown = `
<details>
<summary>Complex content</summary>

## Subtitle

- List item 1
- List item 2

**Bold text** and *italic text*

\`\`\`javascript
const code = "example";
\`\`\`

</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      const detailsNode = result[0];

      // 内容应该包含多种类型
      const contentTypes = detailsNode.children.slice(1).map((node: any) => node.type);

      expect(contentTypes).toContain('h2');  // 子标题
      expect(contentTypes).toContain('ul');  // 列表
      expect(contentTypes).toContain('code_block');  // 代码块
    });
  });

  describe('边界情况', () => {
    test('应该处理只有 summary 没有内容的 details', () => {
      const editor = createTestEditor();

      const markdown = `
<details>
<summary>Only summary</summary>
</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      expect(result[0].type).toBe('details');
      expect(result[0].children.length).toBeGreaterThanOrEqual(1);
    });

    test('应该处理空的 details', () => {
      const editor = createTestEditor();

      const markdown = `<details><summary></summary></details>`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      expect(result[0].type).toBe('details');
    });

    test('应该处理特殊字符', () => {
      const editor = createTestEditor();

      const markdown = `
<details>
<summary>Special: <>&"'</summary>

Content with "quotes" and 'apostrophes'

</details>
`;

      const processed = preprocessMarkdown(markdown);
      const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

      const detailsNode = result[0];
      const summaryNode = detailsNode.children?.[0];
      const summaryText = summaryNode?.children?.map((c: any) => c.text).join('') ?? '';

      // 特殊字符应该被正确处理
      expect(summaryText).toBeTruthy();
    });

    test('应该处理线上真实脏数据的完整流程', () => {
      const editor = createTestEditor();

      // 生产环境真实数据：包含嵌套、未闭合标签、富文本、代码块等
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

<details><summary>~~这里填写预警标题~~</summary>这里填写隐藏内容</details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)

<details><summary>inner image</summary>![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)</details>

<details><summary>这里填写预警标题</summary><details><summary>这里填写预警标题</summary>这里填写隐藏内容<details><summary>这里填写预警标题</summary>inner inner</details></details></details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09

<details><summary>

<233

\`\`\`java
hello?world
![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09
\`\`\`

`;

      // 步骤 1: 预处理
      const processed = preprocessMarkdown(realDirtyData);

      // 验证预处理结果
      expect(processed).toBeTruthy();
      expect(processed).toContain('<details>');
      expect(processed).toContain('# 标题1');

      // 步骤 2: 反序列化为 Slate AST
      let result: any;
      expect(() => {
        result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);
      }).not.toThrow();

      // 验证 AST 结构
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // 验证包含标题节点
      const hasHeading = result.some((node: any) => node.type === KEYS.h1);
      expect(hasHeading).toBe(true);

      // 验证包含 details 节点
      const hasDetails = result.some((node: any) => node.type === 'details');
      expect(hasDetails).toBe(true);

      // 查找 details 节点
      const detailsNodes = result.filter((node: any) => node.type === 'details');
      expect(detailsNodes.length).toBeGreaterThan(0);

      // 验证第一个 details 节点的基本结构
      const firstDetails = detailsNodes[0];
      expect(firstDetails.children).toBeDefined();
      expect(firstDetails.children.length).toBeGreaterThan(0);

      // 验证嵌套的 details（如果存在）
      const hasNestedDetails = (node: any): boolean => {
        if (node.type === 'details') {
          return true;
        }
        if (node.children && Array.isArray(node.children)) {
          return node.children.some(hasNestedDetails);
        }
        return false;
      };

      // 检查是否有嵌套结构
      const nestedDetailsCount = detailsNodes.filter((node: any) =>
        node.children?.some((child: any) => hasNestedDetails(child))
      ).length;

      expect(nestedDetailsCount).toBeGreaterThan(0);

      // 步骤 3: 序列化回 Markdown
      let markdown: string;
      expect(() => {
        markdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: result });
      }).not.toThrow();

      // 验证序列化结果
      expect(markdown!).toBeTruthy();
      expect(typeof markdown!).toBe('string');
      expect(markdown!.length).toBeGreaterThan(0);

      // 验证关键内容被保留
      expect(markdown!).toContain('标题1');
      expect(markdown!).toContain('<details>');
    });
  });
});
