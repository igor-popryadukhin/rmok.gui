import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  /// //////////////////////////////////////////////////////////////////////////
  period (state: State, payload) { state.period = payload; },
  project (state: State, payload) { state.project = payload; },
  statuses (state: State, payload) { state.statuses = payload; },
  owner (state: State, payload) { state.owner = payload; },
  user_group (state: State, payload) { state.user_group = payload; },
  tags (state: State, payload) { state.tags = payload; },
  contact_created_at (state: State, payload) { state.contact_created_at = payload; },
  offset (state: State, payload) { state.offset = payload; },
  timezone (state: State, payload) { state.timezone = payload; },

  order_by (state: State, payload) { state.order_by = payload; },
  order_direction (state: State, payload) { state.order_direction = payload; }
  /// //////////////////////////////////////////////////////////////////////////
};

export default mutations;
