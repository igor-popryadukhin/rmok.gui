import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  filter_q (state: State, payload) { state.filter_q = payload; },
  filter_offset (state: State, payload) { state.filter_offset = payload; }
};

export default mutations;
