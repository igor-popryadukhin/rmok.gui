import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  fetch_process (state: State, payload) { state.fetch_process = payload },
  params (state: State, payload) { state.params = payload }
}

export default mutations
