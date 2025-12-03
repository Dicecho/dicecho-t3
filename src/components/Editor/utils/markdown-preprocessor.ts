import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';
import { rehypeNormalizeDetails } from './rehype-normalize-details';

/**
 * 预处理 Markdown 文本，将 HTML <details> 标签转换为 MDX 组件格式
 *
 * 优化版本：使用 rehype 插件处理脏数据
 * - 自动修复未闭合的标签
 * - 规范化缺失的 <summary>
 * - 正确处理嵌套的 details
 */
export function preprocessMarkdownDetails(markdown: string): string {
  if (!markdown || !markdown.toLowerCase().includes('<details')) {
    return markdown;
  }

  // 使用栈来找到顶层的 <details> 块
  const detailsBlocks: Array<{ start: number; end: number; html: string; mdx: string }> = [];
  const tagRegex = /<\/?details[^>]*>/gi;
  const stack: Array<number> = [];
  let match;

  while ((match = tagRegex.exec(markdown)) !== null) {
    const tag = match[0].toLowerCase();
    const pos = match.index;

    if (tag.startsWith('<details')) {
      stack.push(pos);
    } else if (tag === '</details>' && stack.length > 0) {
      const startPos = stack.pop()!;

      // 只处理顶层的 details（栈为空）
      if (stack.length === 0) {
        const endPos = pos + match[0].length;
        const html = markdown.slice(startPos, endPos);
        const mdx = convertDetailsToMDX(html);

        detailsBlocks.push({
          start: startPos,
          end: endPos,
          html,
          mdx,
        });
      }
    }
  }

  // 如果有未闭合的标签，直接使用 rehype 处理整个 markdown
  // rehype 会自动修复未闭合的标签
  if (stack.length > 0) {
    return preprocessWithRehype(markdown);
  }

  // 如果没有找到任何完整的 details 块，直接返回
  if (detailsBlocks.length === 0) {
    return markdown;
  }

  // 从后往前替换完整的 details 块，避免位置偏移
  detailsBlocks.sort((a, b) => b.start - a.start);

  let result = markdown;
  for (const block of detailsBlocks) {
    result = result.slice(0, block.start) + block.mdx + result.slice(block.end);
  }

  // 清理多余的连续空行
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * 使用 rehype 处理包含脏数据的 markdown
 * 用于处理未闭合标签等复杂情况
 *
 * 注意：此函数会自动修复未闭合的标签，然后转换所有 details 节点
 */
function preprocessWithRehype(markdown: string): string {
  try {
    // 1. 解析 HTML（rehype 会自动修复未闭合的标签）
    const tree = unified()
      .use(rehypeParse, { fragment: true })
      .parse(markdown) as Root;

    // 2. 规范化 details 标签
    rehypeNormalizeDetails()(tree);

    // 3. 在 AST 上直接转换 details 节点为文本节点
    //    这样可以避免字符串替换的复杂性
    const transformDetailsInPlace = (node: any) => {
      if (!node.children) return;

      const newChildren: any[] = [];

      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'details') {
          // 转换 details 节点为包含 MDX 的 raw HTML 节点
          const mdx = processDetailsNode(child);
          newChildren.push({
            type: 'raw',
            value: mdx,
          });
        } else {
          // 递归处理子节点
          transformDetailsInPlace(child);
          newChildren.push(child);
        }
      }

      node.children = newChildren;
    };

    transformDetailsInPlace(tree);

    // 4. 使用 rehype-stringify 输出
    // 配置：不使用自闭合标签（如 <img />），因为 MDX 解析器不支持
    const processor = unified()
      .use(rehypeStringify, {
        closeSelfClosing: false,
        allowDangerousHtml: true,
      });

    let result = String(processor.stringify(tree));

    // 5. 清理多余空行
    result = result.replace(/\n{3,}/g, '\n\n');

    return result.trim();
  } catch (error) {
    console.error('[preprocessWithRehype] Error:', error);
    return markdown; // 出错时返回原文
  }
}

/**
 * 将单个 <details> HTML 块转换为 MDX 格式
 * 使用 rehype 解析 HTML 确保正确处理嵌套和属性
 */
function convertDetailsToMDX(html: string): string {
  try {
    // 使用 rehype 解析 HTML
    const tree = unified()
      .use(rehypeParse, { fragment: true })
      .parse(html);

    // 转换 details 元素
    let result = '';
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'details') {
        result = processDetailsNode(node);
        return false; // 停止遍历，我们只需要顶层 details
      }
    });

    return result || html; // 如果转换失败，返回原 HTML
  } catch (error) {
    console.error('[preprocessMarkdownDetails] Error parsing HTML:', error);
    return html; // 出错时返回原 HTML
  }
}

/**
 * 递归处理 details 节点，转换为 MDX 格式
 *
 * 优化：使用标准 HTML <summary> 标签，而不是自定义的 <DetailsSummary>
 * 这样可以：
 * 1. 消除重复存储（不需要 summary 属性）
 * 2. 消除转义/反转义逻辑
 * 3. 使用 remark 原生支持的标签
 */
function processDetailsNode(node: Element): string {
  let summaryContent = '';
  const contentParts: string[] = [];

  for (const child of node.children) {
    if (child.type === 'element' && child.tagName === 'summary') {
      // 保留 summary 的完整 HTML（支持富文本）
      summaryContent = (child.children || []).map(nodeToString).join('');
    } else if (child.type === 'element' && child.tagName === 'details') {
      // 递归处理嵌套的 details
      contentParts.push(processDetailsNode(child));
    } else if (child.type === 'element' || child.type === 'text') {
      contentParts.push(nodeToString(child));
    }
  }

  const content = contentParts.join('').trim();

  // 使用标准 HTML 标签，添加适当的换行符确保 remark-mdx 正确解析
  // 重要：summary 标签内容独占一行，避免单行过长导致解析错误
  // 这对于处理用户输入的单行 <details> 尤其重要
  return `\n\n<details>\n\n<summary>\n${summaryContent || ''}\n</summary>\n\n${content}\n\n</details>\n\n`;
}

/**
 * 将节点转换为字符串（包括 HTML 标签）
 */
function nodeToString(node: any): string {
  if (node.type === 'text') {
    return escapeText(node.value);
  }

  if (node.type === 'element') {
    const tagName = node.tagName;
    const attrs = formatAttributes(node.properties || {});
    const childrenStr = (node.children || []).map(nodeToString).join('');

    // 即便没有子节点，也使用显式的闭合标签，避免自闭合导致 MDX 解析异常
    return `<${tagName}${attrs}>${childrenStr}</${tagName}>`;
  }

  return '';
}

/**
 * 将 HAST properties 序列化为 HTML 属性字符串
 */
function formatAttributes(props: Record<string, any>): string {
  const entries: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'boolean') {
      if (value) entries.push(key);
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      if (key === 'className') {
        entries.push(`class="${escapeAttr(value.join(' '))}"`);
      } else {
        entries.push(`${key}="${escapeAttr(value.join(' '))}"`);
      }
      return;
    }

    if (key === 'className') {
      entries.push(`class="${escapeAttr(String(value))}"`);
      return;
    }

    if (key === 'style') {
      const styleString =
        typeof value === 'string'
          ? value
          : Object.entries(value)
              .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
              .join('; ');
      if (styleString) {
        entries.push(`style="${escapeAttr(styleString)}"`);
      }
      return;
    }

    entries.push(`${key}="${escapeAttr(String(value))}"`);
  });

  return entries.length ? ' ' + entries.join(' ') : '';
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

function escapeText(value: string): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
