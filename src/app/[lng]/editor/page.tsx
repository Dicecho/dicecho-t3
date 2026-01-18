import { RichTextEditor } from "@/components/Editor";

export default async function EditorPlayground() {
  return (
    <div className="container py-8">
      <h1 className="mb-4 text-2xl font-bold">Markdown 渲染测试</h1>
      <RichTextEditor markdown={""} />
    </div>
  );
}
