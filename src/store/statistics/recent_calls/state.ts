
export interface State {
  pie_fetching: boolean;
  pie_labels: string[];
  pie_colors: string[];
  pie_series: number[];

  total_calls: number;
  total_calls_fetching: boolean;

  history_fetching: boolean;
  history: Array<Record<string, unknown>>;
  history_count: number;
}

export function defaultState (): State {
  return {
    pie_fetching: false,
    pie_labels: [],
    pie_colors: [],
    pie_series: [],

    total_calls: 0,
    total_calls_fetching: false,

    history_fetching: false,
    history: [],
    history_count: 0
  };
}

const state = defaultState;

export default state;
