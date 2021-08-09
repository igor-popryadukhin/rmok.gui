import Contact from '@/api/interfaces/Contact'

export interface ContactsState {
  process_loading: boolean;
  total: number;
  items: Contact[];
  selected: number[];
}

function state (): ContactsState {
  return {
    process_loading: false,
    total: 0,
    items: [],
    selected: []
  }
}

export default state
