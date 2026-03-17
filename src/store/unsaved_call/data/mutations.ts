import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  contact_history_id (state, payload) { state.contact_history_id = payload; },
  contact_id (state, payload) { state.contact_id = payload; },
  contact_name (state, payload) { state.contact_name = payload; },
  call_id (state, payload) { state.call_id = payload; },
  direction (state, payload) { state.direction = payload; },
  status_id (state, payload) { state.status_id = payload; },
  comment (state, payload) { state.comment = payload; }
};

export default mutations;
