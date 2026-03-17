
export interface State {
  items_fetching: boolean;
  types: any[];
  items: any[];
}

export function defaultState (): State {
  return {
    items_fetching: false,
    types: [],
    items: []
  };
}

const state = defaultState;

export default state;
