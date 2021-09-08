import Contact from '@/api/interfaces/Contact'

export interface ContactsState {
  process_loading: boolean;
  per_page: number;
  total: number;
  items: Contact[];
  selected: number[];
}

export function defaultState (): ContactsState {
  return {
    process_loading: false,
    per_page: 50,
    total: 0,
    items: [],
    selected: []
  }
}

const state = defaultState()

export default state
