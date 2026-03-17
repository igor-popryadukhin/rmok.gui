
export interface State {
  history_offset: number;
  total: number;
  history: any[];
}

export function defaultState (): State {
  return {
    history_offset: 0,
    total: 0,
    history: []
  };
}

const state = defaultState();

export default state;
