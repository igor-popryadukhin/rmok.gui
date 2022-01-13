import { ContactListState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ContactListState> = {
  loading (state: ContactListState, payload) { state.loading = payload },
  total (state: ContactListState, payload) { state.total = payload },
  items (state: ContactListState, payload) { state.items = payload },
  items_selected (state: ContactListState, payload) { state.items_selected = payload },
  selected_all (state: ContactListState, payload) { state.selected_all = payload },

  /** Сброс состояния */
  flush (state: ContactListState) {
    Object.assign(state, defaultState())
  }
}

export default mutations
