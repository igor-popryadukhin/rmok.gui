import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  period (state: State, payload) { state.period = payload },
  owner_id (state: State, payload) { state.owner_id = payload },
  user_group_id (state: State, payload) { state.user_group_id = payload },
  status_ids (state: State, payload) { state.status_ids = payload },
  project_id (state: State, payload) { state.project_id = payload },
  contact_tag_ids (state: State, payload) { state.contact_tag_ids = payload },
  contact_created_at (state: State, payload) { state.contact_created_at = payload }
}

export default mutations
