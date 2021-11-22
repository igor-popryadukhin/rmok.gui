import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  fill (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.status = payload.status
  }
}

export default mutations
