'use client';

import * as React from 'react';

import { EyeOffIcon } from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';

import { ToolbarButton } from './toolbar';

const DETAILS_NODE_TYPE = 'details';

export function DetailsToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();

  const insertDetailsBlock = React.useCallback(() => {
    editor.tf.insertNodes(
      {
        type: DETAILS_NODE_TYPE,
        children: [
          {
            type: KEYS.p,
            children: [{ text: '' }],
          },
          {
            type: KEYS.p,
            children: [{ text: '' }],
          },
        ],
      },
      { select: true }
    );

    editor.tf.focus();
  }, [editor]);

  return (
    <ToolbarButton
      {...props}
      tooltip="Details block"
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={(event) => {
        event.preventDefault();
        insertDetailsBlock();
      }}
    >
      <EyeOffIcon />
    </ToolbarButton>
  );
}


