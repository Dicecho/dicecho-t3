// @ts-nocheck
/**
 * 覆盖 markdown-kit 中 details 的 serialize/deserialize
 * 直接用 Plate editor API，避免手写 mock 漏掉插件上下文。
 */

import { describe, test, expect } from "@jest/globals";
import { createPlateEditor } from "platejs/react";
import { MarkdownPlugin } from "@platejs/markdown";
import { KEYS } from "platejs";

import { MarkdownKit } from "../markdown-kit";
import { DetailsPlugin } from "../../plugins/details-plugin";
import { preprocessMarkdown } from "../../utils/markdown-preprocessor";

function createEditor() {
  return createPlateEditor({
    plugins: [...MarkdownKit, DetailsPlugin],
  });
}

describe("markdown-kit details serialize/deserialize", () => {
  test("反序列化 summary 富文本", () => {
    const editor = createEditor();
    const md = `
<details>
<summary>**Bold** and *italic*</summary>

Content

</details>
`;
    const processed = preprocessMarkdown(md);
    const slate = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);

    const summary = slate[0].children[0];
    const hasBold = summary.children.some((c: any) => c.bold === true);
    const hasItalic = summary.children.some((c: any) => c.italic === true);
    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
  });

  test("序列化保持 summary 富文本", () => {
    const editor = createEditor();
    const slate = [
      {
        type: "details",
        children: [
          {
            type: KEYS.p,
            children: [
              { text: "Bold", bold: true },
              { text: " and " },
              { text: "italic", italic: true },
            ],
          },
          { type: KEYS.p, children: [{ text: "Content" }] },
        ],
      },
    ];

    const md = editor
      .getApi(MarkdownPlugin)
      .markdown.serialize({ value: slate });
    expect(md).toMatch(/\*\*Bold\*\*/);
    expect(md).toMatch(/_italic_/);
  });

  test("往返保持 summary 文本", () => {
    const editor = createEditor();
    const md = `
<details>
<summary>Roundtrip text</summary>

Body

</details>`;

    const processed = preprocessMarkdown(md);
    const slate = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);
    const md2 = editor
      .getApi(MarkdownPlugin)
      .markdown.serialize({ value: slate });
    const slate2 = editor.getApi(MarkdownPlugin).markdown.deserialize(md2);

    expect(slate2[0].children[0].children[0].text).toBe("Roundtrip text");
    expect(slate2[0].children[1].children[0].text).toContain("Body");
  });

  test("行内 span 样式与删除线往返保留", () => {
    const editor = createEditor();
    const md =
      '~~<span style="background-color: #00FF00;"><span style="color: #FE0000;">测试</span></span>~~';

    const slate = editor.getApi(MarkdownPlugin).markdown.deserialize(md);
    const md2 = editor
      .getApi(MarkdownPlugin)
      .markdown.serialize({ value: slate });

    expect(md2).toContain("background-color: #00FF00");
    expect(md2).toContain("color: #FE0000");
    expect(md2).toMatch(/~~/);
  });

  test("多段不同样式的文本序列化不合并", () => {
    const editor = createEditor();
    const slate = [
      {
        type: KEYS.p,
        children: [
          { text: "多", color: "#FE0000", backgroundColor: "#93C47D" },
          { text: "样", color: "#FFD966", backgroundColor: "#93C47D" },
          { text: "式", color: "#FE0000", backgroundColor: "#CC0000" },
        ],
      },
    ];

    const md = editor
      .getApi(MarkdownPlugin)
      .markdown.serialize({ value: slate });

    expect(md.match(/color: #FE0000/g)?.length).toBeGreaterThanOrEqual(2);
    expect(md).toContain("color: #FFD966");
    expect(md).toContain("background-color: #CC0000");
  });
});
