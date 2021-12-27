import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  visible (state: State, payload) { state.visible = payload },
  available_projects (state: State, payload) { state.available_projects = payload },
  available_users (state: State, payload) { state.available_users = payload },
  project_id (state: State, payload) { state.project_id = payload },
  user_ids (state: State, payload) { state.user_ids = payload }
}

export default mutations
