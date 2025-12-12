# Notification 消息提醒组件

基于旧版 Dicecho 的 NotificationBox 实现，使用 React Query + shadcn/ui 替代 MobX + Ant Design。

## 特性

- ✅ 使用 `useQuery` 管理数据，自动处理防抖和缓存
- ✅ 支持定期轮询（默认 60 秒）
- ✅ 支持按类型过滤（全部/回复/获赞）
- ✅ 支持标记已读和全部已读
- ✅ 使用 shadcn/ui 组件（Tabs、Button、Avatar、Badge）
- ✅ 零特殊情况：用 queryKey 消除过滤逻辑重复

## 文件结构

```
src/
├── types/notification.ts              # 类型定义
├── utils/api.ts                       # DicechoApi 扩展
├── hooks/useNotifications.ts          # React Query hook
└── components/Notification/
    ├── NotificationBox.tsx            # 主组件
    ├── NotificationItem.tsx           # 列表项组件
    ├── index.ts                       # Barrel export
    └── README.md                      # 本文档
```

## 使用方法

### 基础用法

```tsx
import { NotificationBox } from "@/components/Notification";

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div>
      <button onClick={() => setShowNotifications(!showNotifications)}>
        <Bell />
      </button>

      {showNotifications && (
        <div className="absolute top-12 right-0 w-96">
          <NotificationBox
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}
    </div>
  );
}
```

### 使用 Hook（自定义 UI）

```tsx
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType } from "@/types/notification";

function CustomNotifications() {
  const { notifications, unreadCount, markRead, markAllRead, isLoading } =
    useNotifications({
      type: NotificationType.Comment, // 可选：过滤类型
      refetchInterval: 30000, // 可选：轮询间隔（ms）
      enabled: true, // 可选：是否启用查询
    });

  return (
    <div>
      <h2>未读消息 ({unreadCount})</h2>
      {notifications.map((n) => (
        <div key={n._id} onClick={() => markRead(n._id)}>
          {n.sender?.nickName}
        </div>
      ))}
      <button onClick={() => markAllRead()}>全部已读</button>
    </div>
  );
}
```

## API 参考

### NotificationBox Props

| 属性      | 类型       | 默认值 | 说明               |
| --------- | ---------- | ------ | ------------------ |
| visible   | boolean    | true   | 是否显示           |
| onClose   | () => void | -      | 关闭回调           |
| className | string     | -      | 自定义 CSS 类名    |

### useNotifications Options

| 属性            | 类型              | 默认值 | 说明                                 |
| --------------- | ----------------- | ------ | ------------------------------------ |
| type            | NotificationType  | -      | 过滤类型（不传则获取全部）           |
| refetchInterval | number            | 60000  | 轮询间隔（毫秒）                     |
| enabled         | boolean           | true   | 是否启用查询                         |

### useNotifications Return

| 属性            | 类型                  | 说明                   |
| --------------- | --------------------- | ---------------------- |
| notifications   | INotificationDto[]    | 通知列表               |
| unreadCount     | number                | 未读数量               |
| totalCount      | number                | 总数量                 |
| isLoading       | boolean               | 是否加载中             |
| isError         | boolean               | 是否错误               |
| error           | Error                 | 错误对象               |
| markRead        | (id: string) => void  | 标记单条已读           |
| markAllRead     | () => void            | 标记全部已读           |
| isMarkingRead   | boolean               | 是否正在标记已读       |
| isMarkingAllRead| boolean               | 是否正在标记全部已读   |

## 数据结构

### NotificationType（通知类型）

```ts
enum NotificationType {
  Like = "like",       // 点赞
  Comment = "comment", // 评论
  Reply = "reply",     // 回复
  Follow = "follow",   // 关注
}
```

### INotificationDto（通知对象）

```ts
interface BaseNotificationDto {
  _id: string;
  sender?: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
  recipient: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
  isUnread: boolean;
  createdAt: string;
}

// 具体类型见 src/types/notification.ts
type INotificationDto =
  | INotificationLikeDto
  | INotificationCommentDto
  | INotificationReplyDto
  | INotificationFollow;
```

## 技术实现细节

### 对比旧版的改进

| 旧版实现                      | 新版实现                          | 优势                       |
| ----------------------------- | --------------------------------- | -------------------------- |
| MobX Store 手动管理状态       | React Query 自动管理              | 简化代码，消除样板代码     |
| 手动 lastFetchAt 防抖         | useQuery staleTime                | 内置防抖，消除特殊逻辑     |
| 重复的 fetch 调用（2-3 次）   | 单一数据源                        | 消除重复请求               |
| Ant Design（Tabs、Avatar）    | shadcn/ui（更现代、可定制）       | 更好的主题支持             |
| 10+ 行过滤逻辑                | queryKey 自动区分                 | 消除条件分支               |
| react-router useHistory       | Next.js Link                      | 符合项目技术栈             |

### "好品味"体现

1. **数据结构优先**：TypeScript 类型先于实现
2. **消除特殊情况**：用 queryKey 替代 if/else 过滤逻辑
3. **简洁**：核心 hook 只有 50 行，消除了 MobX Store 的 250 行
4. **实用主义**：60 秒轮询足够，不需要 WebSocket

## TODO

- [ ] 评论对话框（CommentDialog）集成
- [ ] 国际化支持
- [ ] 无限滚动加载更多
- [ ] 消息通知铃铛小红点
- [ ] 键盘快捷键支持

## 注意事项

1. 需要在 `DicechoProvider` 内部使用（需要 session）
2. 默认 60 秒轮询，可通过 `refetchInterval` 调整
3. 点击通知项会自动标记为已读
4. 评论相关的对话框功能需要额外实现
