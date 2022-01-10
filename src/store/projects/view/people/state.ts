import User from '@/api/interfaces/User'

export interface ProjectsViewPeopleState {
  fetching: boolean;

  items: User[];
  items_count: number;
}

export function defaultState (): ProjectsViewPeopleState {
  return {
    fetching: false,
    items: [],
    items_count: 0
  }
}

const state = defaultState

export default state
