import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  visible (state: State, payload) { state.visible = payload; },
  count (state: State, payload) { state.count = payload; },
  items (state: State, payload) { state.items = payload; }
};

export default mutations;
