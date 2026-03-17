
export interface State {
  process_loading: boolean;
  total_calls: number;
  client_calls: number;
  history_offset: number;
  history: any[];
}

export function defaultState (): State {
  return {
    process_loading: false,
    total_calls: 0,
    client_calls: 0,
    history_offset: 0,
    history: []
  };
}

const state = defaultState();

export default state;
