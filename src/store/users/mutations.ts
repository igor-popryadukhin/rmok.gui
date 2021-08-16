import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  process_loading (state, payload: boolean) { state.process_loading = payload },
  total (state: State, payload) { state.total = payload },
  items (state: State, payload) { state.items = payload },
  selected (state: State, payload) { state.selected = payload }
}

export default mutations
