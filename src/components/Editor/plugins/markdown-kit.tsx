import {
  MarkdownPlugin,
  remarkMdx,
  remarkMention,
  convertChildrenDeserialize,
  convertNodesSerialize,
  SerializeMdOptions,
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

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      // 自定义转换规则
      rules: {
        span: {
          deserialize: deserializeSpan,
        },
        // 支持 HTML <details> 标签
        details: {
          deserialize: deserializeDetails,
          serialize: serializeDetails,
        },
        // 向后兼容：支持旧的 <Details> MDX 组件
        Details: {
          deserialize: deserializeDetails,
        },
      },
    },
  }),
];
