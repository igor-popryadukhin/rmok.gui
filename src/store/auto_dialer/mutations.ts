import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  fetch_process (state: State, payload) { state.fetch_process = payload },
  params (state: State, payload) { state.params = payload },
  total (state: State, payload) { state.total = payload },
  filter_offset (state, payload) { state.filter_offset = payload }
}

export default mutations
