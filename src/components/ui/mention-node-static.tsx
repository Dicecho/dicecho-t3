import * as React from 'react';

import type { TMentionElement } from 'platejs';
import type { SlateElementProps } from 'platejs/static';

import { KEYS } from 'platejs';
import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';

export function MentionElementStatic(
  props: SlateElementProps<TMentionElement> & {
    prefix?: string;
  }
) {
  const { prefix } = props;
  const element = props.element;
  const firstChild = (element.children?.[0] ?? {}) as Record<string, any>;

  return (
    <SlateElement
      {...props}
      className={cn(
        'inline text-primary font-medium',
        firstChild[KEYS.bold] === true && 'font-bold',
        firstChild[KEYS.italic] === true && 'italic',
        firstChild[KEYS.underline] === true && 'underline'
      )}
      attributes={{
        ...props.attributes,
        'data-slate-value': element.value,
      }}
    >
      {props.children}
      {prefix}@{element.value}
    </SlateElement>
  );
}
