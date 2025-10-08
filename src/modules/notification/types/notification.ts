export type UUID = string;

export type NotificationType =
  | "comment"
  | "like"
  | "system_alert"
  | "reminder"
  | "goal";

export interface Notification {
  id: UUID;
  user_id: UUID;
  actor_id?: UUID | null;
  post_id?: UUID | null;
  notification_title: string;
  notification_message?: string | null;
  type: NotificationType;
  created_at: string;
}
