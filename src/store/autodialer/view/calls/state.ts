import AutodialerCall from '@/api/interfaces/AutodialerCall'

export interface State {
  items: AutodialerCall[];
  items_total: number;
  items_per_page: number;
  items_callers: AutodialerCall[];
  items_callers_total: number;
  items_selected: AutodialerCall[];

  filter_offset: number;
}

function defaultState (): State {
  return {
    items: [],
    items_total: 0,
    items_per_page: 100,
    items_callers: [],
    items_callers_total: 0,
    items_selected: [],

    filter_offset: 0
  }
}

export default defaultState
