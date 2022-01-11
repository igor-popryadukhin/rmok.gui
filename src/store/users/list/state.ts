import User from '@/api/interfaces/User'

export interface UserListState {
  per_page: number;
  total: number;
  items_fetching: boolean;
  items: User[];
}

export function defaultState (): UserListState {
  return {
    per_page: 50,
    total: 0,
    items_fetching: false,
    items: []
  }
}

const state = defaultState

export default state
