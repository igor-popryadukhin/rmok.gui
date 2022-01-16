import defaultState, { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items (state, payload) { state.items = payload },
  items_total (state, payload) { state.items_total = payload },
  items_per_page (state, payload) { state.items_per_page = payload },
  items_callers (state, payload) { state.items_callers = payload },
  items_callers_total (state, payload) { state.items_callers_total = payload },
  items_selected (state, payload) { state.items_selected = payload },

  filter_offset (state: State, payload) { state.filter_offset = payload },

  flush (state: State) { Object.assign(state, defaultState()) }
}

export default mutations
