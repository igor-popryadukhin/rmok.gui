import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  name (state, payload) { state.name = payload },
  permissions (state, payload) { state.permissions = payload },

  fill (state, payload) {
    state.id = payload.id || 0
    state.name = payload.name || ''
    state.permissions = payload.permissions || []
  }
}

export default mutations
