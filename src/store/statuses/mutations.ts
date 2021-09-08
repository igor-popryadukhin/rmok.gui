import { MutationTree } from 'vuex'
import { StatusesState } from './state'

const mutations: MutationTree<StatusesState> = {
  items (state, payload) { state.items = payload }
}

export default mutations
