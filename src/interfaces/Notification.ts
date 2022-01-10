export default interface Notification {
  id: number;
  type: string;
  icon?: string;
  color: string;
  style?: any;
  class?: string;
  title: string;
  message?: string;
  message2?: string;
  context?: Record<string, unknown>;
  /** @deprecated */
  click?: (e: Notification, i: number) => void;
  actions?: NotificationAction[];
}
