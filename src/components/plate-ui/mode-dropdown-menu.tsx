'use client'
import React, { useCallback, useState } from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import {
  focusEditor,
  useEditorReadOnly,
  useEditorRef,
  usePlateStore,
} from "@udecode/plate-common/react";

import { Edit, View } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenState } from './utils';
import { ToolbarButton } from '@/components/plate-ui/toolbar';

export function ModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();
  const openState = useOpenState();

  let value: 'editing' | 'viewing' = "editing";

  if (readOnly) value = "viewing";

  const item = {
    editing: (
      <>
        <Edit className="mr-2 size-5" />
        <span className="hidden lg:inline">Editing</span>
      </>
    ),
    viewing: (
      <>
        <View className="mr-2 size-5" />
        <span className="hidden lg:inline">Viewing</span>
      </>
    ),
  };

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          className="min-w-[auto] lg:min-w-[130px]"
          isDropdown
          pressed={openState.open}
          tooltip="Editing mode"
        >
          {item[value]}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[180px]">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          onValueChange={(newValue) => {
            if (newValue !== "viewing") {
              setReadOnly(false);
            }
            if (newValue === "viewing") {
              setReadOnly(true);

              return;
            }
            if (newValue === "editing") {
              focusEditor(editor);

              return;
            }
          }}
          value={value}
        >
          <DropdownMenuRadioItem value="editing">
            {item.editing}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="viewing">
            {item.viewing}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
