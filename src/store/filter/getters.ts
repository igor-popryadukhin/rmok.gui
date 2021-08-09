import { RootState } from '@/store'
import { FilterState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<FilterState, RootState> = {
  contact_tags (state: FilterState) { return state.contact_tags },
  statuses (state: FilterState) { return state.statuses },
  projects (state: FilterState) { return state.projects },
  users (state: FilterState) { return state.users },
  users_groups (state: FilterState) { return state.users_groups }
}

export default getters
