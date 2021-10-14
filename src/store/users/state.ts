import User from '@/api/interfaces/User'

export interface State {
  process_loading: boolean;
  total: number;
  total_online: number;
  items: User[];
  selected: number[];
}

function state (): State {
  return {
    process_loading: false,
    total: 0,
    total_online: 0,
    items: [],
    selected: []
  }
}

export default state
