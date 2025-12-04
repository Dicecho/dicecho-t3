# Details Plugin 测试文档

## 概述

本目录包含 Details Plugin 的完整测试套件，覆盖从用户输入到最终输出的整个数据流。

## 测试结构

```
__tests__/
├── README.md                              # 本文档
├── details-markdown-integration.test.ts   # ✨ 真实的 Markdown ↔ Slate AST 测试（使用真实的 Plate 编辑器）
├── details-integration.test.ts            # 端到端集成测试（理论示例）
├── utils/
│   ├── markdown-preprocessor.test.ts      # HTML → 规范化 HTML 转换测试
│   └── rehype-normalize-details.test.ts   # Rehype 插件测试
└── plugins/
    └── markdown-kit.test.ts               # Serialize/Deserialize 单元测试（理论示例）
```

## 数据流

```
用户输入 HTML
    ↓
[preprocessMarkdown]
    ↓
MDX <Details><summary>...</summary>...</Details>
    ↓
[remark deserialize]
    ↓
Slate AST { type: 'details', children: [...] }
    ↓
用户编辑
    ↓
[remark serialize]
    ↓
MDX <details><summary>...</summary>...</details>
    ↓
[postprocessDetailsToHtml]
    ↓
HTML 输出
```

## 测试分类

### 0. 🌟 完整集成测试（推荐）

#### details-markdown-integration.test.ts

**这是最重要的测试！** 使用真实的 Plate 编辑器和 MarkdownPlugin。

**测试内容：**
- ✅ Markdown → Slate AST 完整转换
- ✅ Slate AST → Markdown 完整转换
- ✅ 往返测试（Roundtrip）：Markdown → Slate → Markdown
- ✅ 与其他 Markdown 元素混合
- ✅ 向后兼容性验证（旧格式）
- ✅ 富文本支持

**关键特性：**
```typescript
// 创建真实的编辑器实例
const editor = createPlateEditor({
  plugins: [...MarkdownKit, DetailsPlugin],
});

// 测试真实的 deserialize
const slateAST = editor.getApi(MarkdownPlugin).markdown.deserialize(markdown);

// 测试真实的 serialize
const outputMarkdown = editor.getApi(MarkdownPlugin).markdown.serialize({ value: slateAST });
```

**运行测试：**
```bash
npm test details-markdown-integration.test.ts
```

### 1. 单元测试

#### markdown-preprocessor.test.ts

测试 HTML → MDX 的转换逻辑。

**关键测试用例：**
- ✅ 基础转换：简单的 `<details>` 标签
- ✅ 富文本支持：summary 中的 HTML 格式
- ✅ 嵌套处理：多层嵌套的 details
- ✅ 脏数据清理：未闭合标签、缺失 summary
- ✅ 边界情况：空内容、特殊字符、大小写混合

**运行测试：**
```bash
npm test markdown-preprocessor.test.ts
```

#### rehype-normalize-details.test.ts

测试 rehype 插件的 HTML 规范化功能。

**关键测试用例：**
- ✅ Summary 位置规范化
- ✅ 缺失 summary 的自动补全
- ✅ 递归处理嵌套 details
- ✅ 内容保留
- ✅ 性能测试（大量嵌套、大量 details）

**运行测试：**
```bash
npm test rehype-normalize-details.test.ts
```

#### markdown-kit.test.ts

**注意：这是理论测试用例**，展示了应该测试的场景，但没有使用真实的 Plate 编辑器。

实际的集成测试请看 `details-markdown-integration.test.ts`。

**测试用例：**
- 新格式反序列化（`<summary>` 标签）
- 向后兼容（`<DetailsSummary>` 标签）
- 旧格式兼容（`summary` 属性）
- 序列化输出标准格式
- 往返测试（roundtrip）

### 2. 理论集成测试

#### details-integration.test.ts

**注意：这是理论示例**，展示了完整的数据流，但没有实际运行转换。

实际的集成测试请看 `details-markdown-integration.test.ts`。

端到端的完整流程示例。

**关键场景：**
- ✅ 完整编辑流程：输入 → 编辑 → 输出
- ✅ 嵌套 details 处理
- ✅ 脏数据自动修复
- ✅ 富文本内容（表格、图片、格式）
- ✅ 向后兼容性验证
- ✅ 性能测试

**运行测试：**
```bash
npm test details-integration.test.ts
```

## 运行测试

### 推荐：运行完整集成测试

```bash
# 运行真实的 Markdown ↔ Slate AST 集成测试
npm test details-markdown-integration.test.ts

# 这是最重要的测试，验证了：
# ✅ 真实的 Plate 编辑器环境
# ✅ MarkdownPlugin 的实际行为
# ✅ markdown-kit 的 serialize/deserialize
# ✅ 往返转换的一致性
```

### 运行所有测试

```bash
# 运行所有 details 相关测试
npm test -- --testPathPattern=details

# 运行特定测试文件
npm test markdown-preprocessor.test.ts
npm test rehype-normalize-details.test.ts
npm test details-markdown-integration.test.ts

# 运行并查看覆盖率
npm test -- --coverage --testPathPattern=details
```

## 测试覆盖的格式

### 输入格式

1. **标准 HTML**
   ```html
   <details>
     <summary>Summary</summary>
     Content
   </details>
   ```

2. **嵌套 HTML**
   ```html
   <details>
     <summary>Outer</summary>
     <details>
       <summary>Inner</summary>
       Content
     </details>
   </details>
   ```

3. **脏数据**
   ```html
   <details><summary>Test Content  <!-- 缺少闭合标签 -->
   <details>Content</details>      <!-- 缺少 summary -->
   ```

4. **旧版 MDX 格式**
   ```jsx
   <Details summary="Fallback">
     <DetailsSummary>Actual</DetailsSummary>
     Content
   </Details>
   ```

### 输出格式

**统一的标准格式：**
```jsx
<details>
<summary>Summary text</summary>

Content here

</details>
```

## 性能基准

测试包含性能验证，确保：

- ✅ 10层嵌套处理时间 < 100ms
- ✅ 100个 details 处理时间 < 200ms
- ✅ 时间复杂度为 O(n)，而不是 O(n²)

## 向后兼容性

测试验证了三种历史格式的兼容性：

1. **最旧格式**（已废弃）
   ```jsx
   <Details summary="text">Content</Details>
   ```

2. **旧格式**（已废弃）
   ```jsx
   <Details summary="fallback">
     <DetailsSummary>actual</DetailsSummary>
     Content
   </Details>
   ```

3. **当前格式**
   ```jsx
   <Details>
     <summary>text</summary>
     Content
   </Details>
   ```

所有旧格式在读取时都能正确解析，但序列化时统一输出新格式。

## 常见问题排查

### 测试失败：找不到模块

```bash
# 确保安装了测试依赖
npm install --save-dev @jest/globals
```

### 测试失败：类型错误

```bash
# 确保 TypeScript 配置正确
npx tsc --noEmit
```

### 集成测试失败

检查是否正确模拟了 Plate 编辑器环境。集成测试可能需要完整的编辑器上下文。

## 贡献指南

添加新测试时：

1. 确定测试类型（单元/集成）
2. 在相应文件中添加测试用例
3. 使用描述性的测试名称
4. 包含边界情况
5. 更新本文档

## 参考资料

- [Plate.js 文档](https://platejs.org/)
- [Remark/Rehype 插件开发](https://unifiedjs.com/)
- [Jest 测试框架](https://jestjs.io/)
