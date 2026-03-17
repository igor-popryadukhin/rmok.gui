import User from '@/api/interfaces/User';

export interface UserListState {
  filter_query: Record<string, unknown>;
  items_per_page: number;
  items_total: number;
  items_fetching: boolean;
  items: User[];
}

export function defaultState (): UserListState {
  return {
    filter_query: {},
    items_per_page: 50,
    items_total: 0,
    items_fetching: false,
    items: []
  };
}

const state = defaultState;

export default state;
