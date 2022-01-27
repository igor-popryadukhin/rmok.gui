import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  action (state, payload) { state.action = payload }
}

export default mutations
