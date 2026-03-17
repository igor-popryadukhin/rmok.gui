export interface State {
  filter_originator: number;
  filter_offset: number;

  items_per_page: number;
  items_count: number;
  items: any[];
}

function state (): State {
  return {
    filter_originator: 0,
    filter_offset: 0,

    items_per_page: 50,
    items_count: 0,
    items: []
  };
}

export default state;
