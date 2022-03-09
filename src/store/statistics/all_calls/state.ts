
export interface State {
  items_fetching: boolean;
  items: Array<Record<string, unknown>>;
  items_count: number;
}

export function defaultState (): State {
  return {
    items_fetching: false,
    items: [],
    items_count: 0
  }
}

const state = defaultState

export default state
