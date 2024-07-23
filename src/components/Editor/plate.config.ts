import { createBasicElementsPlugin } from "@udecode/plate-basic-elements";
import { withProps } from "@udecode/cn";
import { createPlugins, PlateLeaf } from "@udecode/plate-common";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import {
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
} from "@udecode/plate-font";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/plate-heading";
import {
  createBasicMarksPlugin,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";

export const plugins = createPlugins(
  [
    createBasicElementsPlugin(),
    createBasicMarksPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
  ],
  {
    components: {
      // [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
      // [ELEMENT_CODE_BLOCK]: CodeBlockElement,
      // [ELEMENT_CODE_LINE]: CodeLineElement,
      // [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
      // [ELEMENT_HR]: HrElement,
      [ELEMENT_H1]: withProps(HeadingElement, { variant: "h1" }),
      [ELEMENT_H2]: withProps(HeadingElement, { variant: "h2" }),
      [ELEMENT_H3]: withProps(HeadingElement, { variant: "h3" }),
      [ELEMENT_H4]: withProps(HeadingElement, { variant: "h4" }),
      [ELEMENT_H5]: withProps(HeadingElement, { variant: "h5" }),
      [ELEMENT_H6]: withProps(HeadingElement, { variant: "h6" }),
      // [ELEMENT_IMAGE]: ImageElement,
      // [ELEMENT_LI]: withProps(PlateElement, { as: "li" }),
      // [ELEMENT_LINK]: LinkElement,
      // [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
      // [ELEMENT_MENTION]: MentionElement,
      // [ELEMENT_MENTION_INPUT]: MentionInputElement,
      // [ELEMENT_UL]: withProps(ListElement, { variant: "ul" }),
      // [ELEMENT_OL]: withProps(ListElement, { variant: "ol" }),
      // [ELEMENT_PARAGRAPH]: ParagraphElement,
      // [ELEMENT_TABLE]: TableElement,
      // [ELEMENT_TD]: TableCellElement,
      // [ELEMENT_TH]: TableCellHeaderElement,
      // [ELEMENT_TODO_LI]: TodoListElement,
      // [ELEMENT_TR]: TableRowElement,
      // [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
      [MARK_BOLD]: withProps(PlateLeaf, { as: "strong" }),
      [MARK_CODE]: CodeLeaf,
      [MARK_ITALIC]: withProps(PlateLeaf, { as: "em" }),
      [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: "s" }),
      [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: "sub" }),
      [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: "sup" }),
      [MARK_UNDERLINE]: withProps(PlateLeaf, { as: "u" }),
    },
  },
);
