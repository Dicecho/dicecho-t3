import * as React from 'react';

import { NodeApi } from 'platejs';
import { type SlateElementProps, SlateElement } from 'platejs/static';

const FALLBACK_PLACEHOLDER = '填写预警标题';

export function DetailsElementStatic(props: SlateElementProps) {
  const { element, children, ...attributes } = props;
  const childNodes = React.Children.toArray(children);
  const summaryNode = childNodes[0];
  const contentNodes = childNodes.slice(1);
  const summaryText = React.useMemo(() => {
    const summaryElement = (element.children ?? [])[0];
    if (!summaryElement) return '';
    return NodeApi.string(summaryElement as any).trim();
  }, [element.children]);

  const summaryContent =
    summaryNode || summaryText || React.createElement('span', null, FALLBACK_PLACEHOLDER);

  return (
    <SlateElement element={element} as="details" {...attributes}>
      <summary>{summaryContent}</summary>
      {contentNodes}
    </SlateElement>
  );
}

