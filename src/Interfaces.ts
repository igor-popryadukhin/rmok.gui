export interface CrumbInterface {
  title: string;
  name: string;
  path: string;
  class: string;
  latest: boolean;
}

export interface NotificationActionInterface {
  handle: (context: any) => void;
  title: string;
  context?: any;
  [key: string]: any
}

export interface NotificationInterface {
  id?: string;
  type: string;
  icon: string;
  color: string;
  title: string;
  message: string;
  message2?: string;
  context?: Record<string, any>;
  click?: (e: NotificationInterface, i: number) => void;
  actions?: NotificationActionInterface[];
}

export interface MainSearchInterface {
  title: string;
  subtitle: string;
  [key: string]: any;
}

export type MainSearchMethod = (items: MainSearchInterface[]) => MainSearchInterface
