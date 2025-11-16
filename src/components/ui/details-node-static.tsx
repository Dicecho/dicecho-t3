import { type SlateElementProps, SlateElement } from 'platejs/static';

export function DetailsElementStatic(props: SlateElementProps) {
  const { element, children, ...attributes } = props;
  const summary = (element as { summary?: string }).summary || '';

  return (
    <SlateElement element={element} as="details" {...attributes}>
      <summary>{summary}</summary>
      {children}
    </SlateElement>
  );
}

