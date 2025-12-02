import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';

/**
 * 预处理 Markdown 文本,将 HTML <details> 标签转换为 MDX 组件格式
 * 使用 rehype 正确解析 HTML，避免手动正则解析的复杂性
 */
export function preprocessMarkdownDetails(markdown: string): string {
  // 使用栈来找到正确配对的 <details> 块
  const detailsBlocks: Array<{ start: number; end: number; html: string; mdx: string }> = [];
  const tagRegex = /<\/?details[^>]*>/gi;
  const stack: Array<number> = [];
  let match;

  while ((match = tagRegex.exec(markdown)) !== null) {
    const tag = match[0].toLowerCase();
    const pos = match.index;

    if (tag.startsWith('<details')) {
      // 开标签，入栈
      stack.push(pos);
    } else if (tag === '</details>' && stack.length > 0) {
      // 闭标签，出栈
      const startPos = stack.pop()!;

      // 如果栈为空，说明这是一个顶层的 details 块
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

  // 从后往前替换，避免位置偏移
  detailsBlocks.sort((a, b) => b.start - a.start);

  let result = markdown;
  for (const block of detailsBlocks) {
    result = result.slice(0, block.start) + block.mdx + result.slice(block.end);
  }

  // 清理剩余的未闭合的小写 <details> 和 <summary> 标签
  // 注意：不能用 gi 标志，否则会误删大写的 <Details>
  result = result
    .replace(/<details[^>]*>/g, '')
    .replace(/<\/details>/g, '')
    .replace(/<summary[^>]*>/g, '')
    .replace(/<\/summary>/g, '');

  // 清理多余的连续空行（保留最多两个换行符）
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
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
 */
function processDetailsNode(node: Element): string {
  let summary = '';
  const contentParts: string[] = [];

  // 遍历子节点
  for (const child of node.children) {
    if (child.type === 'element' && child.tagName === 'summary') {
      // 提取 summary 文本
      summary = extractText(child);
    } else if (child.type === 'element' && child.tagName === 'details') {
      // 递归处理嵌套的 details
      contentParts.push(processDetailsNode(child));
    } else if (child.type === 'element' || child.type === 'text') {
      // 其他内容
      contentParts.push(nodeToString(child));
    }
  }

  // 转义 summary 中的特殊字符
  const escapedSummary = summary
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '');

  const content = contentParts.join('').trim();

  // 生成 MDX 格式
  // MDX 要求: block 元素必须独占段落，前后都需要空行
  return `\n\n<Details summary="${escapedSummary}">\n\n${content}\n\n</Details>\n\n`;
}

/**
 * 提取节点中的纯文本
 */
function extractText(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.type === 'element' && node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

/**
 * 将节点转换为字符串（包括 HTML 标签）
 */
function nodeToString(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.type === 'element') {
    const tagName = node.tagName;
    const childrenStr = (node.children || []).map(nodeToString).join('');

    // 自闭合标签
    if (!node.children || node.children.length === 0) {
      return `<${tagName} />`;
    }

    return `<${tagName}>${childrenStr}</${tagName}>`;
  }
  return '';
}

/**
 * 将编辑器导出的 <Details summary="..."> MDX 组件转换回标准 HTML details 结构
 */
export function postprocessDetailsToHtml(markdown: string): string {
  if (!markdown || !markdown.includes('<Details')) {
    return markdown;
  }

  const detailsBlocks: Array<{ start: number; end: number; html: string }> = [];
  const tagRegex = /<\/?Details[^>]*>/g;
  const stack: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(markdown)) !== null) {
    const tag = match[0];
    const pos = match.index;

    if (tag.startsWith('<Details')) {
      stack.push(pos);
    } else if (tag === '</Details>' && stack.length > 0) {
      const startPos = stack.pop()!;

      if (stack.length === 0) {
        const endPos = pos + tag.length;
        const mdx = markdown.slice(startPos, endPos);
        const html = convertDetailsMdxToHtml(mdx);

        detailsBlocks.push({
          start: startPos,
          end: endPos,
          html,
        });
      }
    }
  }

  if (detailsBlocks.length === 0) {
    return markdown;
  }

  detailsBlocks.sort((a, b) => b.start - a.start);

  let result = markdown;
  for (const block of detailsBlocks) {
    result = result.slice(0, block.start) + block.html + result.slice(block.end);
  }

  return result;
}

function convertDetailsMdxToHtml(mdxBlock: string): string {
  const openingTagMatch = mdxBlock.match(/<Details[^>]*>/i);

  if (!openingTagMatch || openingTagMatch.index === undefined) {
    return mdxBlock;
  }

  const summaryMatch = openingTagMatch[0].match(/summary="([^"]*)"/i);
  const rawSummary = summaryMatch?.[1] ?? '';
  const summary = unescapeSummary(rawSummary);

  const innerStart = openingTagMatch.index + openingTagMatch[0].length;
  const innerEnd = mdxBlock.lastIndexOf('</Details>');
  const innerContent =
    innerEnd > innerStart ? mdxBlock.slice(innerStart, innerEnd) : '';

  const processedContent = postprocessDetailsToHtml(innerContent).trim();

  const contentSection =
    processedContent.length > 0 ? `\n\n${processedContent}\n\n` : '\n\n';

  return `<details><summary>${summary}</summary>${contentSection}</details>`;
}

function unescapeSummary(value: string): string {
  return value
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, '')
    .trim();
}
