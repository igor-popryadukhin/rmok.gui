import { ContactsViewMessagesState, defaultState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ContactsViewMessagesState> = {
  items_fetching (state, payload) { state.items_fetching = payload; },
  items (state, payload) { state.items = payload; },

  /** Сброс состояния */
  flush (state) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
