import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  filter_originator (state, payload) { state.filter_originator = payload; },
  filter_offset (state, payload) { state.filter_offset = payload; },

  items_count (state, payload) { state.items_count = payload; },
  items (state, payload) { state.items = payload; }
};

export default mutations;
