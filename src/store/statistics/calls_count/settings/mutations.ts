import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  filter_width (state: State, payload) { state.filter_width = payload }
}

export default mutations
