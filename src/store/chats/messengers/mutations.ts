import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  fetching (state: State, payload) { state.fetching = payload; },
  items (state: State, payload) { state.items = payload; }
};

export default mutations;
