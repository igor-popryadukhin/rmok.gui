export interface State {
  filter_q: string;
  filter_offset: number;
}

export function defaultState (): State {
  return {
    filter_q: '',
    filter_offset: 0
  }
}

export const state = defaultState
