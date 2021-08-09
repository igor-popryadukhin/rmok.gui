import Contact from '@/api/interfaces/Contact'

export interface State {
  process_loading: boolean;
  total: number;
  offset: number;
  items: Contact[];
  more_available: boolean;
}

function state (): State {
  return {
    process_loading: false,
    total: 0,
    offset: 0,
    items: [],
    more_available: true
  }
}

export default state
