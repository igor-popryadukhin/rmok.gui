import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items (state, payload) { state.items = payload },
  total (state: State, payload) { state.total = payload },
  filter_offset (state: State, payload) { state.filter_offset = payload }
}

export default mutations
