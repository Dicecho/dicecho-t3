import type { PaginatedResponse } from "@dicecho/types";

export enum NotificationType {
  Like = "like",
  Comment = "comment",
  Reply = "reply",
  Follow = "follow",
}

export interface NotificationFilter {
  type?: NotificationType;
  isUnread?: boolean;
}

export interface NotificationListQuery {
  pageSize?: number;
  page?: number;
  filter?: Partial<NotificationFilter>;
}

export interface BaseNotificationDto {
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

export interface INotificationLikeRate extends BaseNotificationDto {
  type: NotificationType.Like;
  data: {
    targetName: "Rate";
    targetId: string;
    content: string;
    attitude: string;
    mod: {
      _id: string;
      title: string;
    };
  };
}

export interface INotificationLikeComment extends BaseNotificationDto {
  type: NotificationType.Like;
  data: {
    targetName: "Comment";
    targetId: string;
    content: string;
    attitude: string;
  };
}

export interface INotificationCommentCollection extends BaseNotificationDto {
  type: NotificationType.Comment;
  data: {
    _id: string;
    targetName: "Collection";
    targetId: string;
    content: string;
    collection: {
      _id: string;
      title: string;
    };
  };
}

export interface INotificationCommentRate extends BaseNotificationDto {
  type: NotificationType.Comment;
  data: {
    _id: string;
    targetName: "Rate";
    targetId: string;
    content: string;
    remark: string;
    mod: {
      _id: string;
      title: string;
    };
  };
}

export interface INotificationCommentTopic extends BaseNotificationDto {
  type: NotificationType.Comment;
  data: {
    _id: string;
    targetName: "Topic";
    targetId: string;
    content: string;
    topic: {
      title: string;
    };
    domain: {
      _id: string;
      title: string;
    };
  };
}

export interface INotificationReply extends BaseNotificationDto {
  type: NotificationType.Reply;
  data: {
    _id: string;
    targetName: string;
    targetId: string;
    content: string;
    replyToContent: string;
  };
}

export interface INotificationFollow extends BaseNotificationDto {
  type: NotificationType.Follow;
  data: Record<string, never>;
}

export type INotificationReplyDto = INotificationReply;
export type INotificationCommentDto =
  | INotificationCommentRate
  | INotificationCommentTopic
  | INotificationCommentCollection;
export type INotificationLikeDto =
  | INotificationLikeRate
  | INotificationLikeComment;

export type INotificationDto =
  | INotificationLikeDto
  | INotificationCommentDto
  | INotificationReplyDto
  | INotificationFollow;

export interface NotificationPaginatedResponse<T> extends PaginatedResponse<T> {
  unreadCount: number;
}
