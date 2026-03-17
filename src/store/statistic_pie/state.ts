
export interface State {
  process_loading: boolean;
  labels: string[];
  series: string[];
  colors: string[];
}

export function defaultState (): State {
  return {
    process_loading: false,
    labels: [],
    series: [],
    colors: []
  };
}

const state = defaultState();

export default state;
