import User from '@/api/interfaces/User';

export interface State {
  items: User[];
  total: number;
  per_page: number;
  filter_offset: number;
}

function state (): State {
  return {
    items: [],
    total: 0,
    per_page: 30,
    filter_offset: 0
  };
}

export default state;
