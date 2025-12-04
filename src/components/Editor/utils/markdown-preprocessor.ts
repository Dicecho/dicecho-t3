import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { rehypeNormalizeDetails } from './rehype-normalize-details';

/**
 * 预处理 Markdown 文本，修复所有未闭合的 HTML 标签
 *
 * 职责：
 * - 修复未闭合的 HTML 标签（所有标签，不仅是 <details>）
 * - 规范化 <details> 结构（添加缺失的 <summary>）
 * - 格式化 <details> 为多行（remarkMdx 需要多行才能识别为 JSX）
 */
export function preprocessMarkdown(markdown: string): string {
  if (!markdown) {
    return markdown;
  }

  // 预处理：把 <br> 转换为 \n（在 parse 之前）
  markdown = markdown.replace(/<\/?br\s*\/?>/gi, '\n');

  // unified 插件链
  const result = String(
    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeNormalizeDetails)
      .use(rehypeFormatDetails)  // 自定义 compiler
      .processSync(markdown)
  );

  return result.trim();
}

/**
 * rehype 插件：自定义 compiler，格式化 <details> 为多行
 *
 * 为什么是自定义 compiler：
 * - 替换 rehype-stringify 的默认行为
 * - 可以在 stringify 阶段添加自定义格式化
 *
 * 为什么需要多行：
 * - remarkMdx 只识别多行 HTML 为 JSX 元素
 * - 单行 HTML 会被当作普通文本/段落
 */
function rehypeFormatDetails() {
  // @ts-ignore - this 绑定到 unified processor
  this.Compiler = function (tree: any) {
    // 使用 rehype-stringify 编译
    const html = String(
      unified()
        .use(rehypeStringify, {
          closeSelfClosing: false,
          allowDangerousHtml: true,
        })
        .stringify(tree)
    );

    // 格式化 <details> 标签
    return html
      // <details> 标签独占一行
      .replace(/<details([^>]*)>/gi, '\n\n<details$1>\n\n')
      // </details> 标签独占一行
      .replace(/<\/details>/gi, '\n\n</details>\n\n')
      // <summary> 标签独占一行
      .replace(/<summary([^>]*)>/gi, '<summary$1>\n')
      // </summary> 标签独占一行
      .replace(/<\/summary>/gi, '\n</summary>\n\n')
      // 清理多余的连续空行
      .replace(/\n{3,}/g, '\n\n');
  };
}
