import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  id (state, payload) { state.id = payload; }
};

export default mutations;
