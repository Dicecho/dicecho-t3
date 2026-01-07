# GitHub 驱动的 Feedback 系统设计文档

## 0. 背景与目标

目标：
在不自建后台后台管理系统的前提下，完全依赖 GitHub Issues / Discussions / Projects，实现网站的：

* 用户反馈（Bug / 功能建议 / 提问）
* 开发进度 / Roadmap 展示
* 单条反馈详情查看
* 与开源社区协同（用户可以在 GitHub 上继续参与讨论）

后端使用 Next.js Route Handlers 调用 GitHub API。

---

## 1. 整体架构与数据流

### 1.1 数据流概览

1. 用户访问 `/feedback` 页面：

   * 前端调用自家 API（例如：`GET /api/feedback/issues`、`GET /api/feedback/roadmap`）；
   * 后端 API 使用服务端密钥调用 **GitHub API** 获取 Issue / Project 等信息；
   * 结果缓存（revalidate）后返回给前端渲染。

2. 用户在网站提交反馈（表单）：

   * 前端表单 `POST /api/feedback`；
   * 后端校验 & 防 spam；
   * 后端通过 **GitHub API** 在指定仓库创建 Issue，并打上标签 / metadata；
   * 返回创建好的 issue 链接，前端可展示给用户。

3. GitHub 端事件更新（可选但推荐）：

   * 配置 GitHub Webhook 指向 `/api/github/webhook`；
   * 当 Issue 状态 / Label 变化、Project 列变动等事件发生时，Webhook 通知后端；
   * 后端清除缓存 / 记录事件日志 / 给站内用户发通知（可选）。

---

## 2. GitHub 侧约定

### 2.1 仓库

新建或选用一个专门的仓库，例如：

* `github.com/<OWNER>/<REPO>` = `github.com/dicecho/feedback`

所有网站反馈、Roadmap、进度都围绕这个仓库的 Issues / Projects 实现。

### 2.2 Labels 约定

约定一套固定的标签方案，用于前端分组展示：

#### 类型类标签（type）

* `type:bug`
* `type:feature`
* `type:question`
* `type:other`

#### 来源标签（from）

* `from:site`（通过网站反馈表单创建的 issue）
* `from:github`（用户直接在 GitHub 手动创建的 issue，可选）

#### 状态 / Roadmap 标签（status）

* `status:planned`       // 已接收 / 在计划中
* `status:in-progress`   // 开发中
* `status:done`          // 已完成
* `status:rejected`      // 拒绝 / 暂不考虑

标签的名字可以自定义，但要在代码里做映射。

### 2.3 Issue 模板（可选但推荐）

在 repo 中创建 `.github/ISSUE_TEMPLATE/`，例如：

* `bug_report.yml`
* `feature_request.yml`

目的是给从 GitHub 直接创建 issue 的用户一个规范的格式，但网站端的 API 创建 issue 不必完全遵守模板。

### 2.4 Projects / Milestones（用于 Roadmap）

二选一或混用：

1. 使用 **Milestones**：

   * 例如：`v1.0`, `v1.1`, `Q1 Roadmap`；
   * 前端用 milestone 作为分组展示。

2. 使用 **Projects v2**：

   * 创建一个 Project，例如「Product Roadmap」；
   * 列（Columns）对应状态：Todo / In Progress / Done；
   * 前端根据 Project item 的列来推断状态（高级玩法，可后续再实现）。

MVP 阶段建议：**仅用 status labels 来反映 Roadmap**，Project 作为后续增强。

### 2.5 Issue Body 中的元数据约定

当网站代表用户创建 issue 时，在正文底部附加一段隐式 metadata（HTML 注释形式）：

```markdown
<!--
source: site
site-user-id: <内部用户ID或匿名>
site-locale: <如: ja-JP / zh-CN>
site-url: <提交时所在的页面URL>
-->
```

这样 Webhook 收到事件时，可以反查到底是哪位站内用户的反馈。

---

## 3. 前端页面设计（/feedback）

假设有一个主页面 `/feedback`，以及一个详情页 `/feedback/[number]`。

### 3.1 路由结构

* `app/feedback/page.tsx`

  * Feedback 总览页，包含 Tabs：

    * 「全部反馈」/「Bug」/「功能」/「问题」等
    * 「开发进度 / Roadmap」
    * 「提交反馈」表单
* `app/feedback/[number]/page.tsx`

  * 单条 Issue 详情页（展示 GitHub issue 的标题、正文、labels、状态等）

### 3.2 Feedback 总览页 UI

#### 顶部 Tab 示例

* Tab1：`Issues`（全部 + 筛选）
* Tab2：`Roadmap`
* Tab3：`提交反馈`

使用 shadcn/ui 的 `<Tabs />` 组件即可。

#### Tab1：Issue 列表

* 前端请求：`GET /api/feedback/issues?type=bug&status=open`
* 列表展示字段：

  * 标题（点击跳转到 `/feedback/[number]` 或 GitHub 原始链接）
  * 状态：Open / Closed / (In Progress) – 可根据 `state` + `status:*` label 映射
  * 类型：Bug / Feature / Question 等（由 `type:*` label 映射）
  * 更新时间：`updated_at`
  * 简短内容摘要：正文前 N 行

UI: 用 `Card` + `Badge` + `Separator` 等组件。

#### Tab2：Roadmap

数据来源：

* `GET /api/feedback/roadmap`

后端实现可以简单为：

* 从 GitHub 获取 issues；
* 根据 `status:*` label 分组：

  * Planned → 列表1
  * In Progress → 列表2
  * Done → 列表3

前端展示为：

* 三列或者三段 collapsible section：

  * 每列下是 Issue 列表（只显示标题 + 链接 + 簡要标签）。

#### Tab3：提交反馈表单

表单字段建议：

* 类型：下拉选择（`type`）
* 标题：文本输入
* 描述：多行输入
* 复选框：

  * “我知道这些内容会公开显示在 GitHub 上，请勿填写隐私信息”

POST 到：`/api/feedback`

如果你有站内用户体系，可以额外收集：

* 当前用户 ID / 昵称（不必显示在表单，后端通过 session 获取）

成功后：

* 显示「反馈已创建」toast；
* 可显示「在 GitHub 中查看此反馈」按钮（来自后端返回的 `html_url`）。

---

## 4. 后端 API 设计（Next.js Route Handlers）

> 所有 API 都运行在服务端，使用服务端的 GitHub Token 调 GitHub API。

### 4.1 配置

环境变量（例）：

```bash
GITHUB_OWNER=dicecho
GITHUB_REPO=feedback
GITHUB_TOKEN=ghp_xxx   # 或使用 GitHub App 的安装 Token
```

在代码中封装一个简易的 GitHub 客户端：

```ts
// lib/github.ts
const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN!;

export async function githubFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
```

---

### 4.2 `GET /api/feedback/issues`

**用途**：前端列表展示 issue（可按类型 / 状态筛选）。

路由文件：`app/api/feedback/issues/route.ts`

#### 请求参数（query）

* `page?: number`，默认 `1`
* `per_page?: number`，默认 `20`（<= 100）
* `type?: "bug" | "feature" | "question" | "other"`（可选，映射到 label）
* `status?: "open" | "closed" | "all"`（默认 `open`，映射到 GitHub `state`）
* `label?: string`（通用 label 过滤）
* `search?: string`（可选，后续升级为 GitHub 搜索 API）

#### GitHub API 调用示例

```ts
const params = new URLSearchParams({
  state: status ?? "open",
  per_page: String(perPage),
  page: String(page),
});

const issues = await githubFetch(
  `/repos/${OWNER}/${REPO}/issues?${params.toString()}`
);
```

然后在服务端过滤包含 `type:*` label 的 issue，按需要筛选。

#### 响应结构（建议）

```ts
export interface FeedbackIssue {
  number: number;
  title: string;
  body: string;
  htmlUrl: string;
  state: "open" | "closed";
  labels: string[];           // label 名称列表
  type: "bug" | "feature" | "question" | "other" | "unknown";
  statusLabel?: "planned" | "in-progress" | "done" | "rejected";
  createdAt: string;          // ISO
  updatedAt: string;          // ISO
}

export interface FeedbackIssueListResponse {
  items: FeedbackIssue[];
  page: number;
  perPage: number;
  hasNextPage: boolean;
}
```

---

### 4.3 `GET /api/feedback/issues/[number]`

**用途**：单条 issue 详情页。

路由文件：`app/api/feedback/issues/[number]/route.ts`

#### 响应结构（建议）

复用 `FeedbackIssue`，并增加评论列表（可后续实现）：

```ts
export interface FeedbackComment {
  id: number;
  body: string;
  author: string;
  authorAvatarUrl: string;
  createdAt: string;
}

export interface FeedbackIssueDetailResponse extends FeedbackIssue {
  comments: FeedbackComment[];
}
```

实现：

* `GET /repos/{owner}/{repo}/issues/{issue_number}`
* `GET /repos/{owner}/{repo}/issues/{issue_number}/comments`

---

### 4.4 `GET /api/feedback/roadmap`

**用途**：Roadmap 页使用。

实现方式（MVP）：

* 查询全部 open/closed issues（或限制最多 200 条）；
* 根据标签 `status:*` 分组；

响应结构建议：

```ts
export interface RoadmapGroup {
  key: "planned" | "in-progress" | "done" | "rejected";
  title: string;           // e.g. "Planned", "In Progress", ...
  items: FeedbackIssue[];
}

export interface RoadmapResponse {
  groups: RoadmapGroup[];
}
```

---

### 4.5 `POST /api/feedback`

**用途**：网站反馈表单提交，创建 GitHub issue。

路由文件：`app/api/feedback/route.ts`

#### 请求体（JSON）

```ts
export interface FeedbackCreateRequest {
  type: "bug" | "feature" | "question" | "other";
  title: string;
  description: string;
  pageUrl?: string;   // 可选：用户反馈时所在的页面
}
```

后端也可以从 session 中获取内部用户 ID：

* `siteUserId: string | null`

#### 后端处理流程

1. 校验字段长度、必填项。
2. 简单防 spam（例如每 IP 一段时间内的限制；或后续接入 hCaptcha）。
3. 组装 issue body：

```ts
const body = `
${description}

---

_This issue was created from the website feedback form._

<!--
source: site
site-user-id: ${siteUserId ?? "anonymous"}
site-page-url: ${pageUrl ?? "unknown"}
-->
`;
```

4. 计算对应的 label 列表：

```ts
const labels = [`from:site`, `type:${type}`];
```

5. 调用 GitHub API 创建 issue：

```ts
const created = await githubFetch(
  `/repos/${OWNER}/${REPO}/issues`,
  {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      labels,
    }),
  }
);
```

6. 返回结果：

```ts
export interface FeedbackCreateResponse {
  number: number;   // issue number
  htmlUrl: string;  // GitHub 链接
}
```

---

### 4.6 `POST /api/github/webhook`

**用途**：GitHub Webhook 入口。

主要用途（MVP 阶段）：

* 收到 `issues` 事件时，清除相关缓存（例如某个 issue 详情、issue 列表）。

GitHub Webhook 配置：

* 事件：`issues`, `issue_comment`（后续用得上再加）
* 内容类型：`application/json`
* Secret：`GITHUB_WEBHOOK_SECRET`（环境变量）

伪代码示例：

```ts
// app/api/github/webhook/route.ts
export async function POST(req: Request) {
  const signature = req.headers.get("X-Hub-Signature-256") ?? "";
  const event = req.headers.get("X-GitHub-Event");

  const rawBody = await req.text();
  // TODO: 验证签名（HMAC SHA256）与 GITHUB_WEBHOOK_SECRET 匹配

  const payload = JSON.parse(rawBody);

  switch (event) {
    case "issues":
      // payload.action: opened / closed / edited / reopened / ...
      // payload.issue.number
      // -> 清除对应 issue 的缓存，清除列表缓存
      break;
    case "issue_comment":
      // 同理处理评论更新
      break;
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
```

缓存实现方式可以是：

* 使用 Next.js `revalidateTag` / `revalidatePath`；
* 或者你自己的 Redis / KV。

---

## 5. 缓存与性能策略

### 5.1 缓存层

考虑 GitHub Rate Limit 和页面性能：

* Issue 列表：`revalidate: 60–120 秒`；
* Issue 详情：`revalidate: 30–60 秒`；
* Roadmap：`revalidate: 120–300 秒`；

在 Route Handler 中：

```ts
// example in GET /api/feedback/issues
export const revalidate = 60; // Next.js 级别的 revalidate
```

或者使用 `fetch` 的 `next: { revalidate: 60 }` 选项。

### 5.2 错误处理

* 若 GitHub API 调用失败：

  * API 返回 502 / 503，并在 body 中说明是 GitHub API 错误；
  * 前端展示「暂时无法加载反馈，请稍后重试」。
* 可以加简单回退：如果有本地缓存（Redis / KV）可以返回缓存中的旧数据。

---

## 6. 安全与隐私注意事项

1. 表单前明确提醒用户：

   * 「反馈将以公开 issue 的形式发布到 GitHub，请不要填写个人隐私信息。」
2. 如果未来要支持**私密反馈**：

   * 另开一个内部渠道（存数据库，不发到 public repo）。
3. GitHub Token 必须是：

   * 具备最小权限的 PAT 或 GitHub App 安装 Token；
   * 存在 server-side 环境变量中，不要暴露到客户端。

---

## 7. 后续可扩展方向（非 MVP 必做）

* 在「我的反馈」页根据 `site-user-id` 过滤用户自己的反馈。
* 读取 Discussions 并在另一个 Tab 展示。
* 将 GitHub Projects v2 正式接入，作为更完善的 Roadmap 看板。
* 支持在网站内展示 issue 评论，并允许登录用户直接在网站内回复（后端代理调用 `POST /issues/{number}/comments`）。
* 接入通知系统：当 issue 被标记为 `status:done` 时，通过邮件 / 站内通知提醒原始反馈用户。

---

如果你愿意，我还可以在这份文档的基础上，直接再写一份「具体代码脚手架」：
包括 `app/api/feedback/route.ts`、`app/api/feedback/issues/route.ts` 等文件的完整 TypeScript 版本，你可以直接拷到项目里跑。
