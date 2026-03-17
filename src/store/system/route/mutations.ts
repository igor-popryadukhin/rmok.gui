import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  full_path (state: State, payload) { state.full_path = payload; }
};

export default mutations;
