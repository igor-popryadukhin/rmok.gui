
export interface State {
  items_offset: number;
  items_count: number;
  items: Array<Record<string, unknown>>;
}

function defaultState (): State {
  return {
    items_offset: 0,
    items_count: 50,
    items: []
  }
}

export default defaultState
