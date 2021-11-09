import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  visible (state, payload) { state.visible = payload }
}

export default mutations
