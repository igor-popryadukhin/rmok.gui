import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  contact_tags (state: State) { return state.contact_tags },
  statuses (state: State) { return state.statuses },
  projects (state: State) { return state.projects },
  users (state: State) { return state.users },
  users_groups (state: State) { return state.users_groups },
  roles (state: State) { return state.roles },
  timezone (state: State) { return state.timezone }
}

export default getters
