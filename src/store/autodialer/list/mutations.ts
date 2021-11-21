import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items (state: State, payload) { state.items = payload },
  total (state: State, payload) { state.total = payload }
}

export default mutations
