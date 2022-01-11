import Role from '@/api/interfaces/Role'

export interface RolesState {
  items_offset: number;
  items_count: number;
  items_fetching: boolean;
  items: Role[];
}

function defaultState (): RolesState {
  return {
    items_offset: 0,
    items_count: 50,
    items_fetching: false,
    items: []
  }
}

export default defaultState
