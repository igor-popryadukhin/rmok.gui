
export interface State {
  pie_fetching: boolean;
  pie_labels: string[];
  pie_colors: string[];
  pie_series: number[];

  history_fetching: boolean;
  history: Array<Record<string, any>>;
}

export function defaultState (): State {
  return {
    pie_fetching: false,
    pie_labels: [],
    pie_colors: [],
    pie_series: [],

    history_fetching: false,
    history: []
  }
}

const state = defaultState()

export default state
