import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items_offset (state, payload) { state.items_offset = payload },
  items_count (state, payload) { state.items_count = payload },
  items (state, payload) { state.items = payload }
}

export default mutations
