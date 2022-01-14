import { LeadsState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<LeadsState> = {
  items (state: LeadsState, payload) { state.items = payload },
  items_total (state: LeadsState, payload) { state.items_total = payload },
  items_fetching (state: LeadsState, payload) { state.items_fetching = payload },

  /** Сброс состояния */
  flush (state: LeadsState) {
    Object.assign(state, defaultState())
  }
}

export default mutations
