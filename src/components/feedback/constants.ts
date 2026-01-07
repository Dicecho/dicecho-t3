export type FeedbackType = "bug" | "feature" | "question";

export const FEEDBACK_TYPE_OPTIONS: { value: FeedbackType; labelKey: string }[] = [
  { value: "bug", labelKey: "feedback_type_bug" },
  { value: "feature", labelKey: "feedback_type_feature" },
  { value: "question", labelKey: "feedback_type_question" },
];
