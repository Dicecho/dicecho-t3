import { BaseMentionPlugin, BaseMentionInputPlugin } from "@platejs/mention";

import { MentionElementStatic } from "@/components/ui/mention-node-static";

export const BaseMentionKit = [
  BaseMentionPlugin.configure({
    options: {
      triggerPreviousCharPattern: /^$|^[\s"']$/,
    },
  }).withComponent(MentionElementStatic),
  BaseMentionInputPlugin,
];
