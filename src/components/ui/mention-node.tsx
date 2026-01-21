'use client';

import * as React from 'react';

import type { TComboboxInputElement, TMentionElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { getMentionOnSelectItem } from '@platejs/mention';
import { IS_APPLE, KEYS } from 'platejs';
import {
  PlateElement,
  useFocused,
  useReadOnly,
  useSelected,
} from 'platejs/react';

import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';
import { useIsMobile } from '@/hooks/use-is-mobile';
import {
  UserMentionCombobox,
  type MentionUserItem,
} from '@/components/Editor/components/UserMentionCombobox';

import {
  InlineCombobox,
  InlineComboboxInput,
} from './inline-combobox';

export function MentionElement(
  props: PlateElementProps<TMentionElement> & {
    prefix?: string;
  }
) {
  const element = props.element;

  const selected = useSelected();
  const focused = useFocused();
  const mounted = useMounted();
  const readOnly = useReadOnly();
  const firstChild = (element.children?.[0] ?? {}) as Record<string, any>;

  return (
    <PlateElement
      {...props}
      className={cn(
        'inline text-primary font-medium',
        !readOnly && 'cursor-pointer hover:underline',
        selected && focused && 'rounded-sm ring-2 ring-ring ring-offset-1',
        firstChild[KEYS.bold] === true && 'font-bold',
        firstChild[KEYS.italic] === true && 'italic',
        firstChild[KEYS.underline] === true && 'underline'
      )}
      attributes={{
        ...props.attributes,
        contentEditable: false,
        'data-slate-value': element.value,
        draggable: true,
      }}
    >
      {mounted && IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        <>
          {props.children}
          {props.prefix}
          @{element.value}
        </>
      ) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        <>
          {props.prefix}
          @{element.value}
          {props.children}
        </>
      )}
    </PlateElement>
  );
}

// 自定义 onSelectItem，支持 key 字段
const onSelectItem = getMentionOnSelectItem<MentionUserItem>({ key: 'key' });

export function MentionInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [search, setSearch] = React.useState('');
  const isMobile = useIsMobile();

  const handleSelectItem = React.useCallback(
    (item: MentionUserItem) => {
      onSelectItem(editor, item, search);
    },
    [editor, search]
  );

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox
        value={search}
        element={element}
        setValue={setSearch}
        showTrigger={false}
        trigger="@"
        filter={false}
        autoSelectFirst={!isMobile}
      >
        <span className="text-primary font-medium">
          @<InlineComboboxInput />
        </span>

        <UserMentionCombobox search={search} onSelectItem={handleSelectItem} />
      </InlineCombobox>

      {props.children}
    </PlateElement>
  );
}
