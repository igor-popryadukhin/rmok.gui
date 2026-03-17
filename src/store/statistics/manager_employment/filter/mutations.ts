import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  period (state: State, payload) { state.period = payload; },
  project (state: State, payload) { state.project = payload; },

  flush (state: State) { Object.assign(state, defaultState()); }
};

export default mutations;
