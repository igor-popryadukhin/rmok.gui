export interface ActionInterface {
  title: string;
  type: string;
  component: string;
  data: any;
}

export interface StatusInterface {
  id?: string | number;
  name: string;
  actions: ActionInterface[];
}
