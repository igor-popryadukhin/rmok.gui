import Contact from '@/api/interfaces/Contact'

export interface LeadsState {
  items: Contact[];
  items_total: number;
  items_fetching: boolean;
}

export function defaultState (): LeadsState {
  return {
    items: [],
    items_total: 0,
    items_fetching: false
  }
}

const state = defaultState

export default state
