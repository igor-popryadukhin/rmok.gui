
export interface State {
  id: number;
  name: string;
  permissions: Array<Record<string, unknown>>;
}

function defaultState (): State {
  return {
    id: 0,
    name: '',
    permissions: []
  }
}

export default defaultState
