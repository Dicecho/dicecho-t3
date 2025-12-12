import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDicecho } from "./useDicecho";
import type {
  NotificationListQuery,
  NotificationType,
} from "@/types/notification";

// Build notification query object
function buildNotificationQuery(
  type?: NotificationType,
  pageSize?: number,
): Partial<NotificationListQuery> {
  return {
    filter: type ? { type } : undefined,
    ...(pageSize !== undefined && { pageSize }),
  };
}

// Shared mutations for marking notifications as read
export function useNotificationMutations() {
  const { api } = useDicecho();
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (uuid: string) => api.notification.markRead(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.notification.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}

// Standard query for notifications (one page)
interface UseNotificationsOptions {
  type?: NotificationType;
  refetchInterval?: number;
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { api, initialized } = useDicecho();
  const { type, refetchInterval = 60000, enabled = true } = options;

  const query = buildNotificationQuery(type);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", query],
    queryFn: () => api.notification.list(query),
    enabled: initialized && enabled,
    refetchInterval,
    staleTime: 30000,
  });

  const mutations = useNotificationMutations();

  return {
    notifications: notificationsQuery.data?.data ?? [],
    unreadCount: notificationsQuery.data?.unreadCount ?? 0,
    totalCount: notificationsQuery.data?.totalCount ?? 0,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    ...mutations,
  };
}

// Infinite query for notifications (multiple pages with pagination)
interface UseInfiniteNotificationsOptions {
  type?: NotificationType;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteNotifications(
  options: UseInfiniteNotificationsOptions = {},
) {
  const { api, initialized } = useDicecho();
  const { type, pageSize = 20, enabled = true } = options;

  const query = buildNotificationQuery(type, pageSize);

  const notificationsQuery = useInfiniteQuery({
    queryKey: ["notifications", "infinite", query],
    queryFn: ({ pageParam = 1 }) =>
      api.notification.list({ ...query, page: pageParam }),
    enabled: initialized && enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 30000,
  });

  const mutations = useNotificationMutations();

  const notifications =
    notificationsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notificationsQuery.data?.pages[0]?.unreadCount ?? 0;
  const totalCount = notificationsQuery.data?.pages[0]?.totalCount ?? 0;

  return {
    notifications,
    unreadCount,
    totalCount,
    isLoading: notificationsQuery.isLoading,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    hasNextPage: notificationsQuery.hasNextPage,
    fetchNextPage: notificationsQuery.fetchNextPage,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    ...mutations,
  };
}
