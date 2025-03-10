export type notificationTypes = "success" | "error" | "info" | "warning";

export interface Notifications {
  message: string;
  type: notificationTypes;
}
