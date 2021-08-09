import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  process_loading (state: State, payload: boolean) { state.process_loading = payload },
  total (state: State, payload) { state.total = payload },
  offset (state: State, payload) { state.offset = payload },
  items (state: State, payload) { state.items = payload },
  more_available (state: State, payload) { state.more_available = payload }
}

export default mutations
