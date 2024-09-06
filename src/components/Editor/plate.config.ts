import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import { withProps } from "@udecode/cn";
import { usePlateEditor, PlateLeaf } from "@udecode/plate-common/react";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from "@udecode/plate-font";
import {
  HEADING_KEYS
} from "@udecode/plate-heading";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import type { WithPlateOptions } from "@udecode/plate-common/react";


export const useMyEditor = (options: Omit<WithPlateOptions, 'plugins'>) => {
  return usePlateEditor({
    plugins: [
      BasicElementsPlugin,
      BoldPlugin,
      CodePlugin,
      ItalicPlugin,
      StrikethroughPlugin,
      SubscriptPlugin,
      SuperscriptPlugin,
      UnderlinePlugin,
      FontBackgroundColorPlugin,
      FontColorPlugin,
      FontSizePlugin,
    ],
    override: {
      components: {
      // [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
      // [ELEMENT_CODE_BLOCK]: CodeBlockElement,
      // [ELEMENT_CODE_LINE]: CodeLineElement,
      // [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
      // [ELEMENT_HR]: HrElement,
      [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
      [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
      [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
      [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
      [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
      [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
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
      [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
      [CodePlugin.key]: CodeLeaf,
      [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
      [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
      [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
      [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
      [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
      }
    },
    ...options,
  });
}