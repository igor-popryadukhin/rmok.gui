
export interface State {
  history_fetching: boolean;
  history: Array<Record<string, unknown>>;
  history_count: number;
}

export function defaultState (): State {
  return {
    history_fetching: false,
    history: [],
    history_count: 0
  }
}

const state = defaultState

export default state
