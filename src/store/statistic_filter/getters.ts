import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  period (state: State) { return state.period },
  owner_id (state: State) { return state.owner_id },
  user_group_id (state: State) { return state.user_group_id },
  status_ids (state: State) { return state.status_ids },
  project_id (state: State) { return state.project_id },
  contact_tag_ids (state: State) { return state.contact_tag_ids },
  contact_created_at (state: State) { return state.contact_created_at }
}

export default getters
