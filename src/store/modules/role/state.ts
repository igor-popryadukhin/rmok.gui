export interface State {
  id: number;
  name: string;
  permissions: string[];
}

export function defaultState (): State {
  return {
    id: 0,
    name: '',
    permissions: []
  }
}

const state = defaultState()

export default state
