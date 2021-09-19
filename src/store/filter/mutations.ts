import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  contact_tags (state, payload) { state.contact_tags = payload },
  statuses (state, payload) { state.statuses = payload },
  projects (state, payload) { state.projects = payload },
  users (state, payload) { state.users = payload },
  users_groups (state, payload) { state.users_groups = payload },
  roles (state, payload) { state.roles = payload },
  timezone (state, payload) { state.timezone = payload }
}

export default mutations
