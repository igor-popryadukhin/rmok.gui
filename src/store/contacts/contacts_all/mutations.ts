import { ContactsListState, defaultState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ContactsListState> = {
  error (state: ContactsListState, payload) { state.error = payload; },
  error_text (state: ContactsListState, payload) { state.error_text = payload; },
  loading (state: ContactsListState, payload) { state.loading = payload; },
  items (state: ContactsListState, payload) { state.items = payload; },
  items_total (state: ContactsListState, payload) { state.items_total = payload; },
  items_selected (state: ContactsListState, payload) { state.items_selected = payload; },
  selected_all (state: ContactsListState, payload) { state.selected_all = payload; },

  /** Сброс состояния */
  flush (state: ContactsListState) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
