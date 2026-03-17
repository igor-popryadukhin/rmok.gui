export interface State {
  id: number;
}

function defaultState (): State {
  return {
    id: 0
  };
}

export const state = defaultState();
