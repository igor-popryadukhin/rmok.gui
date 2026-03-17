import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  items_fetching (state: State, payload) { state.items_fetching = payload; },
  items (state: State, payload) { state.items = payload; },
  items_count (state: State, payload) { state.items_count = payload; },

  flush (state: State) { Object.assign(state, defaultState()); }
};

export default mutations;
