import Contact from '@/api/interfaces/Contact'

export interface ContactsState {
  process_loading: boolean;
  total: number;
  items: Contact[];
  selected: number[];
}

export function defaultState (): ContactsState {
  return {
    process_loading: false,
    total: 0,
    items: [],
    selected: []
  }
}

const state = defaultState()

export default state
