
export interface State {
  items_fetching: boolean;
  items: any[];
}

export function defaultState (): State {
  return {
    items_fetching: false,
    items: []
  };
}

const state = defaultState;

export default state;
