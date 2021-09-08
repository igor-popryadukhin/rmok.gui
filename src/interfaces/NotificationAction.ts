export default interface NotificationAction {
  handle: (context: any) => void;
  title: string;
  context?: any;
  [key: string]: any
}
