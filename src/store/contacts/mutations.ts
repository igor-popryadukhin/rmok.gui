import { ContactsState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ContactsState> = {
  process_loading (state, payload: boolean) { state.process_loading = payload },
  total (state: ContactsState, payload) { state.total = payload },
  items (state: ContactsState, payload) { state.items = payload },
  selected (state: ContactsState, payload) { state.selected = payload },
  selected_all (state: ContactsState, payload) { state.selected_all = payload },

  /** Сброс состояния */
  flush (state: ContactsState) {
    Object.assign(state, defaultState())
  }
}

export default mutations
