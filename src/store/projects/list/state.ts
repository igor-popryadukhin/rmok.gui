import Task from '@/api/interfaces/Task';

export interface ProjectsListState {
  per_page: number;
  total: number;
  items_fetching: boolean;
  items: Task[];
}

export function defaultState (): ProjectsListState {
  return {
    per_page: 50,
    total: 0,
    items_fetching: false,
    items: []
  };
}

const state = defaultState;

export default state;
