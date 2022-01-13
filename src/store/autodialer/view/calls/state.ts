interface Call {
  id: number;
  is_new: boolean
}

export interface State {
  items: Call[];
  items_selected: number[];
  total: number;
  per_page: number;
  filter_offset: number;
}

function state (): State {
  return {
    items: [],
    items_selected: [],
    total: 0,
    per_page: 30,
    filter_offset: 0
  }
}

export default state
