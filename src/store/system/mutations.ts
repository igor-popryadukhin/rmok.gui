import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  permissions (state: State, payload) { state.permissions = payload; }
};

export default mutations;
