import { createPlateEditor } from 'platejs/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { MarkdownKit } from './src/components/Editor/plugins/markdown-kit.tsx';
import { DetailsPlugin } from './src/components/Editor/plugins/details-plugin.tsx';
import { preprocessMarkdownDetails } from './src/components/Editor/utils/markdown-preprocessor.ts';

const editor = createPlateEditor({
  plugins: [
    ...MarkdownKit,
    DetailsPlugin,
  ],
});

const markdown = `
<details>
<summary>**Bold** and *italic*</summary>

Content

</details>
`;

console.log('=== Input ===');
console.log(markdown);

const processed = preprocessMarkdownDetails(markdown);
console.log('\n=== Preprocessed ===');
console.log(processed);

const result = editor.getApi(MarkdownPlugin).markdown.deserialize(processed);
console.log('\n=== Deserialized AST ===');
console.log(JSON.stringify(result, null, 2));

if (result[0]) {
  console.log('\n=== Details Node ===');
  console.log('Type:', result[0].type);
  console.log('Children count:', result[0].children?.length);

  if (result[0].children?.[0]) {
    console.log('\n=== Summary Node (first child) ===');
    console.log('Type:', result[0].children[0].type);
    console.log('Children:', JSON.stringify(result[0].children[0].children, null, 2));
  }
}
