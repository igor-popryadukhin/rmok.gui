import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items (state, payload) {
    state.items = payload
  }
}

export default mutations
