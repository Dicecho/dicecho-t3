import { RichTextEditor } from "@/components/Editor/RichTextEditor";

const testMarkdown = `
阿这

~~***嵌套格式***~~

~~删除线~~

**加粗** *斜*

# 标题1

## 标题2

### 标题3

#### 标题4

##### 标题5

###### 标题6

[link](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)

<details><summary>~~这里填写预警标题~~</summary>这里填写隐藏内容</details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)

<details><summary>inner image</summary>![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f096001d6e49df/202111221529339.png)</details>

<details><summary>这里填写预警标题</summary><details><summary>这里填写预警标题</summary>这里填写隐藏内容<details><summary>这里填写预警标题</summary>inner inner</details></details></details>

![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09

<details><summary>

<233

\`\`\`java
hello?world
![mod/600af94a44f096001d6e49df/202111221529339.png](https://file.dicecho.com/mod/600af94a44f09
\`\`\`
`;

export default async function EditorPlayground() {
  return (
    <div className="container py-8">
      <h1 className="mb-4 text-2xl font-bold">Markdown 渲染测试</h1>
      <RichTextEditor markdown={testMarkdown} />
    </div>
  );
}
