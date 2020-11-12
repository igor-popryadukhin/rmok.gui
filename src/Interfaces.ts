export interface CrumbInterface {
  title: string;
  name: string;
  path: string;
  class: string;
  latest: boolean;
}

export interface NotificationInterface {
  icon: string;
  color: string;
  title: string;
  message: string;
}

export interface MainSearchInterface {
  title: string;
  subtitle: string;
  [key: string]: any;
}

export type MainSearchMethod = (items: MainSearchInterface[]) => MainSearchInterface
