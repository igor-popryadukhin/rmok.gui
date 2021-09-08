import User from '@/api/interfaces/User'

export interface State {
  process_loading: boolean;
  total: number;
  items: User[];
  selected: number[];
}

function state (): State {
  return {
    process_loading: false,
    total: 0,
    items: [],
    selected: []
  }
}

export default state
