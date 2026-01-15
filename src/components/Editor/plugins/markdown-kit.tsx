import {
  MarkdownPlugin,
  remarkMdx,
  remarkMention,
  convertChildrenDeserialize,
  convertNodesSerialize,
  SerializeMdOptions,
  defaultRules,
} from "@platejs/markdown";
import { KEYS, NodeApi } from "platejs";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

function parseStyle(node: any): { color?: string; backgroundColor?: string } {
  // mdxJsxTextElement: attributes array; element: properties.style
  let styleText: string | undefined;

  if (Array.isArray(node.attributes)) {
    const styleAttr = node.attributes.find((a: any) => a.name === "style");
    if (styleAttr) {
      styleText =
        typeof styleAttr.value === "string" ? styleAttr.value : undefined;
    }
  }

  if (!styleText && node.properties?.style) {
    styleText = String(node.properties.style);
  }

  const result: { color?: string; backgroundColor?: string } = {};
  if (!styleText) return result;

  styleText.split(";").forEach((rule) => {
    const [rawKey, rawVal] = rule.split(":");
    if (!rawKey || !rawVal) return;
    const key = rawKey.trim().toLowerCase();
    const val = rawVal.trim();
    if (key === "color") result.color = val;
    if (key === "background-color") result.backgroundColor = val;
  });

  return result;
}

function applyStyleMarks(
  nodes: any[],
  style: { color?: string; backgroundColor?: string },
) {
  if (!Array.isArray(nodes)) return nodes;

  const visit = (n: any): any => {
    if (!n) return n;
    if (Array.isArray(n)) return n.map(visit);
    if (n.text !== undefined) {
      if (style.color) n.color = style.color;
      if (style.backgroundColor) n.backgroundColor = style.backgroundColor;
      return n;
    }
    if (Array.isArray(n.children)) {
      n.children = n.children.map(visit);
    }
    return n;
  };

  return nodes.map(visit);
}

function deserializeSpan(mdastNode: any, deco: any, options: any) {
  const style = parseStyle(mdastNode);
  const children = convertChildrenDeserialize(
    mdastNode.children ?? [],
    deco,
    options,
  );
  if (!style.color && !style.backgroundColor) return children;
  return applyStyleMarks(children, style);
}

function serializeLeafWithStyle(leaf: any) {
  // base text
  let node: any = {
    type: "text",
    value: leaf.text ?? "",
  };

  if (leaf.italic) {
    node = { type: "emphasis", children: [node] };
  }
  if (leaf.bold) {
    node = { type: "strong", children: [node] };
  }
  if (leaf.strikethrough) {
    node = { type: "delete", children: [node] };
  }

  const styleParts: string[] = [];
  if (leaf.underline) styleParts.push("text-decoration: underline");
  if (leaf.color) styleParts.push(`color: ${leaf.color}`);
  if (leaf.backgroundColor) styleParts.push(`background-color: ${leaf.backgroundColor}`);

  if (styleParts.length > 0) {
    node = {
      type: "mdxJsxTextElement",
      name: "span",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "style",
          value: styleParts.join("; "),
        },
      ],
      children: [node],
    };
  }

  return [node];
}

function serializeParagraph(node: any, options: SerializeMdOptions) {
  const children = node.children ?? [];
  const mdChildren: any[] = [];

  children.forEach((child: any) => {
    if (child.text !== undefined) {
      mdChildren.push(...serializeLeafWithStyle(child));
    } else {
      mdChildren.push(...convertNodesSerialize([child], options));
    }
  });

  return {
    type: "paragraph",
    children: mdChildren,
  };
}

export function deserializeDetails(mdastNode: any, deco: any, options: any) {
  const childrenMdast: any[] = mdastNode.children ?? [];

  const summaryElementIndex = childrenMdast.findIndex(
    (child) =>
      (child?.type === "element" && child.tagName === "summary") ||
      (child?.type === "mdxJsxFlowElement" && child.name === "summary"),
  );

  let remainingChildren = childrenMdast;
  let summaryChildren: any[] = [{ text: "" }];

  if (summaryElementIndex !== -1) {
    // 新格式：使用标准 <summary> 标签，保留其富文本子节点
    const summaryChild = childrenMdast[summaryElementIndex];
    const deserialized = convertChildrenDeserialize(
      summaryChild.children ?? [],
      deco,
      options,
    );

    if (Array.isArray(deserialized) && deserialized.length > 0) {
      // 将所有反序列化结果的 children 展平，避免因格式化换行产生多个段落而丢失后续行内节点
      const flattened: any[] = [];
      deserialized.forEach((node: any) => {
        if (Array.isArray(node.children) && node.children.length) {
          flattened.push(...node.children);
        } else {
          flattened.push(node);
        }
      });

      if (flattened.length > 0) {
        summaryChildren = flattened;
      }
    }

    remainingChildren = [
      ...childrenMdast.slice(0, summaryElementIndex),
      ...childrenMdast.slice(summaryElementIndex + 1),
    ];
  } else {
    // 旧格式：<Details summary="...">，只能拿到纯文本
    const summaryAttr = mdastNode.attributes?.find(
      (attr: any) => attr.name === "summary",
    );
    summaryChildren = [{ text: summaryAttr?.value || "" }];
  }

  const summaryNode = {
    type: KEYS.p,
    children: summaryChildren,
  };

  const contentChildren = remainingChildren.length
    ? convertChildrenDeserialize(remainingChildren, deco, options)
    : [
        {
          type: KEYS.p,
          children: [{ text: "" }],
        },
      ];

  return {
    type: "details",
    children: [summaryNode, ...contentChildren],
  };
}

export function serializeDetails(slateNode: any, options: SerializeMdOptions) {
  const children = slateNode.children || [];
  const [summaryNode, ...contentChildren] = children;
  const summaryText = summaryNode
    ? NodeApi.string(summaryNode).replace(/\s+/g, " ").trim()
    : "";

  const summaryChildrenMdast =
    summaryNode && Array.isArray(summaryNode.children)
      ? convertNodesSerialize(summaryNode.children, options)
      : [];

  const blockChildren =
    contentChildren.length > 0
      ? contentChildren
      : [
          {
            type: KEYS.p,
            children: [{ text: "" }],
          },
        ];

  const contentMdast = convertNodesSerialize(blockChildren, options, true);

  return {
    type: "mdxJsxFlowElement",
    name: "details",
    attributes: [],
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "summary",
        attributes: [],
        children:
          summaryChildrenMdast.length > 0
            ? summaryChildrenMdast
            : [
                {
                  type: "text",
                  value: summaryText,
                },
              ],
      },
      ...contentMdast,
    ],
  };
}

/**
 * 旧格式 details 序列化
 * 旧格式特点：
 * - summary 作为 details 节点的属性存在（如 { type: "details", summary: "xxx", children: [...] }）
 * - 如果没有 summary 属性，所有 children 都是 content，summary 应该为空
 */
export function serializeLegacyDetails(slateNode: any, options: SerializeMdOptions) {
  const children = slateNode.children || [];

  // 旧格式：summary 作为属性
  const summaryText = typeof slateNode.summary === "string" ? slateNode.summary : "";

  // 所有 children 都是 content
  const contentMdast = convertNodesSerialize(
    children.length > 0
      ? children
      : [{ type: KEYS.p, children: [{ text: "" }] }],
    options,
    true
  );

  return {
    type: "mdxJsxFlowElement",
    name: "details",
    attributes: [],
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "summary",
        attributes: [],
        children: [{ type: "text", value: summaryText }],
      },
      ...contentMdast,
    ],
  };
}

const { backgroundColor, color, fontFamily, fontSize, fontWeight, ...restDefaultRules } =
  defaultRules as any;

const baseRules = {
  ...restDefaultRules,
  text: {
    deserialize: restDefaultRules.text.deserialize,
    serialize: serializeLeafWithStyle,
  },
  p: {
    deserialize: restDefaultRules.p?.deserialize,
    serialize: serializeParagraph,
  },
  span: {
    deserialize: deserializeSpan,
    serialize: restDefaultRules.span.serialize,
  },
  // 向后兼容：支持旧的 <Details> MDX 组件
  Details: {
    deserialize: deserializeDetails,
  },
};

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      rules: {
        ...baseRules,
        details: {
          deserialize: deserializeDetails,
          serialize: serializeDetails,
        },
      },
    },
  }),
];

/**
 * 旧格式 MarkdownKit
 * 用于序列化 richTextState 字段中的旧格式 AST
 * 旧格式特点：details 的 summary 作为属性存在，children 全是 content
 */
export const LegacyMarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      rules: {
        ...baseRules,
        details: {
          deserialize: deserializeDetails,
          serialize: serializeLegacyDetails,
        },
      },
    },
  }),
];
