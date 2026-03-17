
export interface State {
  filter_width: number;
}

export function defaultState (): State {
  return {
    filter_width: 280
  };
}

export const state = defaultState();
