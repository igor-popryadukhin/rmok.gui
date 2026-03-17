import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  filter_q (state: State, payload) { state.filter_q = payload; },
  filter_status_id (state: State, payload) { state.filter_status_id = payload; },
  filter_state (state: State, payload) { state.filter_state = payload; },
  filter_planned_for (state: State, payload) { state.filter_planned_for = payload; },
  filter_offset (state: State, payload) { state.filter_offset = payload; }
};

export default mutations;
