
export interface State {
  activity: any[];
  types: any[];
}

export function defaultState (): State {
  return {
    activity: [],
    types: []
  };
}

const state = defaultState();

export default state;
