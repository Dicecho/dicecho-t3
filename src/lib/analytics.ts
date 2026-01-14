/**
 * Google Analytics event tracking utilities
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

declare global {
  interface Window {
    gtag?: {
      (command: "event", action: string, params?: Record<string, string | number | undefined>): void;
      (command: "set", params: Record<string, string | undefined>): void;
      (command: "config", targetId: string, params?: Record<string, string | undefined>): void;
    };
  }
}

/**
 * Send a custom event to Google Analytics
 */
export function trackEvent({ action, category, label, value, ...rest }: GTagEvent) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
      ...rest,
    });
  }
}

/**
 * Set or clear the user ID for authenticated user tracking
 */
export function setUserId(userId: string | undefined) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("set", { user_id: userId });
  }
}

// ============================================
// User Authentication Events
// ============================================

export function trackSignIn(method: string = "credentials") {
  trackEvent({
    action: "login",
    category: "authentication",
    method,
  });
}

export function trackSignUp(method: string = "credentials") {
  trackEvent({
    action: "sign_up",
    category: "authentication",
    method,
  });
}

export function trackSignOut() {
  trackEvent({
    action: "logout",
    category: "authentication",
  });
}

// ============================================
// Scenario Events
// ============================================

export function trackScenarioDownload(scenarioId: string, scenarioTitle?: string) {
  trackEvent({
    action: "download",
    category: "scenario",
    label: scenarioTitle,
    item_id: scenarioId,
  });
}

export function trackScenarioPublish(scenarioId: string) {
  trackEvent({
    action: "publish",
    category: "scenario",
    item_id: scenarioId,
  });
}

export function trackScenarioContribute(scenarioId: string) {
  trackEvent({
    action: "contribute",
    category: "scenario",
    item_id: scenarioId,
  });
}

// ============================================
// Rate (Review) Events
// ============================================

export function trackRateCreate(scenarioId: string, rating: number) {
  trackEvent({
    action: "rate",
    category: "rate",
    item_id: scenarioId,
    value: rating,
  });
}

// ============================================
// Collection Events
// ============================================

export function trackCollectionCreate(collectionId: string) {
  trackEvent({
    action: "create",
    category: "collection",
    item_id: collectionId,
  });
}

export function trackCollectionAddItem(collectionId: string, scenarioId: string) {
  trackEvent({
    action: "add_to_collection",
    category: "collection",
    item_id: collectionId,
    scenario_id: scenarioId,
  });
}

// ============================================
// Search Events
// ============================================

export function trackSearch(searchTerm: string, searchType: "scenario" | "topic" | "user" | "tag" = "scenario") {
  trackEvent({
    action: "search",
    category: "search",
    label: searchTerm,
    search_type: searchType,
  });
}

// ============================================
// Social Events
// ============================================

export function trackFollow(userId: string) {
  trackEvent({
    action: "follow",
    category: "social",
    user_id: userId,
  });
}

export function trackUnfollow(userId: string) {
  trackEvent({
    action: "unfollow",
    category: "social",
    user_id: userId,
  });
}

// ============================================
// Forum Events
// ============================================

export function trackTopicCreate(topicId: string) {
  trackEvent({
    action: "create",
    category: "forum",
    item_id: topicId,
  });
}

export function trackTopicReply(topicId: string) {
  trackEvent({
    action: "reply",
    category: "forum",
    item_id: topicId,
  });
}

// ============================================
// Replay (Video) Events
// ============================================

export function trackReplayUpload(bvid: string) {
  trackEvent({
    action: "upload",
    category: "replay",
    item_id: bvid,
  });
}

// ============================================
// Feedback Events
// ============================================

export function trackFeedbackCreate() {
  trackEvent({
    action: "create",
    category: "feedback",
  });
}

// ============================================
// Share Events
// ============================================

export function trackShare(url: string, method?: string) {
  trackEvent({
    action: "share",
    category: "content",
    label: url,
    method,
  });
}
