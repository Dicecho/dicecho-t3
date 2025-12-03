/**
 * Rehype 插件：规范化 <details> 标签
 *
 * 处理用户输入的脏数据：
 * - 未闭合的标签
 * - 缺失的 <summary>
 * - 错误的嵌套
 *
 * 输出规范的 <details><summary>...</summary>...</details> 结构
 */

import { visit } from 'unist-util-visit';
import type { Element, Root, Text } from 'hast';

interface DetailsNode extends Element {
  tagName: 'details';
}

/**
 * Rehype 插件主函数
 */
export function rehypeNormalizeDetails() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'details') {
        return;
      }

      // 规范化 details 节点
      normalizeDetailsElement(node);
    });
  };
}

/**
 * 规范化单个 details 元素
 */
function normalizeDetailsElement(node: Element): void {
  const children = node.children || [];

  // 查找 summary 元素
  const summaryIndex = children.findIndex(
    (child) => child.type === 'element' && child.tagName === 'summary'
  );

  let summaryElement: Element;
  let contentChildren: any[];

  if (summaryIndex !== -1) {
    // 有 summary，提取它
    summaryElement = children[summaryIndex] as Element;
    contentChildren = [
      ...children.slice(0, summaryIndex),
      ...children.slice(summaryIndex + 1),
    ];
  } else {
    // 没有 summary，创建一个空的
    summaryElement = {
      type: 'element',
      tagName: 'summary',
      properties: {},
      children: [{ type: 'text', value: '' } as Text],
    };
    contentChildren = children;
  }

  // 递归处理嵌套的 details
  contentChildren = contentChildren.map((child) => {
    if (child.type === 'element' && child.tagName === 'details') {
      normalizeDetailsElement(child as DetailsNode);
    }
    return child;
  });

  // 确保 summary 有内容（至少是空文本节点）
  if (!summaryElement.children || summaryElement.children.length === 0) {
    summaryElement.children = [{ type: 'text', value: '' } as Text];
  }

  // 重建 children：summary 在前，内容在后
  node.children = [summaryElement, ...contentChildren];
}

/**
 * 提取文本内容
 */
function extractText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}
