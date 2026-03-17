export interface State {
  id: number;
  name: string;
  key: string;
  permissions: string[];
}

export function defaultState (): State {
  return {
    id: 0,
    name: '',
    key: '',
    permissions: []
  };
}

const state = defaultState();

export default state;
