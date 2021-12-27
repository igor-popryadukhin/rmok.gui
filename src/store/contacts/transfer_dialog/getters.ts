import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  visible (state: State) { return state.visible },
  available_projects (state: State) { return state.available_projects },
  available_users (state: State) { return state.available_users },
  project_id (state: State) { return state.project_id },
  user_ids (state: State) { return state.user_ids }
}

export default getters
