import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  fetching (state, payload) { state.fetching = payload },

  role_name (state, payload) { state.role_name = payload },
  role_permissions (state, payload) { state.role_permissions = payload },

  fill (state, payload) {
    // state.role_id = payload.id || 0
    state.role_name = payload.name || ''
    state.role_permissions = payload.permissions || []
  }
}

export default mutations
