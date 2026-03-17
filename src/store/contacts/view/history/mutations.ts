import { ContactsViewHistoryState, contactsViewState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ContactsViewHistoryState> = {
  items_fetching (state, payload) { state.items_fetching = payload; },
  items_count (state, payload) { state.items_count = payload; },
  items (state, payload) { state.items = payload; },

  /** Сброс состояния */
  flush (state) {
    Object.assign(state, contactsViewState());
  }
};

export default mutations;
