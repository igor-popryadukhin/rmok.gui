export interface CrumbInterface {
  title: string;
  name: string;
  path: string;
  class: string;
  latest: boolean;
}

export interface NotificationActionInterface {
  handle: (...arg: any) => void;
  title: string;
  arg: any;
  [key: string]: any
}

export interface NotificationInterface {
  type: string;
  icon: string;
  color: string;
  title: string;
  message: string;
  message2?: string;
  actions: NotificationActionInterface[];
}

export interface MainSearchInterface {
  title: string;
  subtitle: string;
  [key: string]: any;
}

export type MainSearchMethod = (items: MainSearchInterface[]) => MainSearchInterface
