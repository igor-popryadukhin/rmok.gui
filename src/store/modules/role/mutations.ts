import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  fill (state: State, payload) {
    state.id = payload.id
    state.name = payload.name
    state.permissions = payload.permissions
  }
}

export default mutations
