import Contact from '@/api/interfaces/Contact'

export interface ContactListState {
  loading: boolean;
  per_page: number;
  total: number;
  items: Contact[];
  items_selected: number[];
  selected_all: boolean;
}

export function defaultState (): ContactListState {
  return {
    loading: false,
    per_page: 50,
    total: 0,
    items: [],
    items_selected: [],
    selected_all: false
  }
}

const state = defaultState()

export default state
