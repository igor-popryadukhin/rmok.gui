import { MutationTree } from 'vuex'
import { StatusesState } from './state'

const mutations: MutationTree<StatusesState> = {
  items (state, payload) { state.items = payload },
  items_fetching (state, payload) { state.items_fetching = payload }
}

export default mutations
