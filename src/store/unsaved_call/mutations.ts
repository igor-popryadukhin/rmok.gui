import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  unsaved (state, payload) { state.unsaved = payload; }
};

export default mutations;
