import Task from '@/api/interfaces/Task'

export interface TasksListState {
  loading: boolean;
  per_page: number;
  total: number;
  items_fetching: boolean;
  items: Task[];
}

export function defaultState (): TasksListState {
  return {
    loading: false,
    per_page: 50,
    total: 0,
    items_fetching: false,
    items: []
  }
}

const state = defaultState

export default state
