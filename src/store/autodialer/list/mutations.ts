import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items_fetching (state: State, payload) { state.items_fetching = payload },
  items (state: State, payload) { state.items = payload },
  total (state: State, payload) { state.total = payload }
}

export default mutations
