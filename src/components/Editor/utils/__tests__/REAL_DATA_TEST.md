# 真实脏数据测试用例

## 测试用例：线上真实脏数据

### 数据来源
生产环境实际用户输入的内容，触发了渲染错误。

### 包含的复杂场景

1. **嵌套的 details**
   - 三层嵌套：`<details>` → `<details>` → `<details>`
   - 每层都有完整的 summary

2. **未闭合的标签**
   - 最后一个 `<details><summary>` 没有闭合
   - 截断的图片链接

3. **富文本混合**
   - summary 中包含删除线：`~~这里填写预警标题~~`
   - details 内容包含图片 markdown

4. **特殊字符**
   - `<233` - 看起来像未完成的 HTML 标签

5. **代码块**
   - details 中包含 Java 代码块
   - 代码块中包含图片链接（不应被解析）

6. **复杂 markdown**
   - 标题（H1-H6）
   - 删除线、粗体、斜体的嵌套组合
   - 图片链接

### 测试目标

确保 preprocessMarkdown 能够：
- ✅ 不抛出错误（鲁棒性）
- ✅ 保留正常的 markdown 内容
- ✅ 正确处理完整的 details 块
- ✅ 优雅降级处理未闭合的标签

### 测试位置
`src/components/Editor/utils/__tests__/markdown-preprocessor.test.ts:244-310`

### 相关问题
- 用户报告：线上渲染此内容触发错误
- 修复方案：preprocessMarkdown 使用 rehype 处理脏数据
- 验证结果：处理成功，不抛出错误
