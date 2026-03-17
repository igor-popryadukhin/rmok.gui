import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  projects (state: State, payload) { state.projects = payload; },
  statuses (state: State, payload) { state.statuses = payload; },
  users (state: State, payload) { state.users = payload; },
  user_groups (state: State, payload) { state.user_groups = payload; },
  tags (state: State, payload) { state.tags = payload; },
  timezones (state: State, payload) { state.timezones = payload; },
  /// //////////////////////////////////////////////////////////////////////////
  period (state: State, payload) { state.period = payload; },
  q (state: State, payload) { state.q = payload; },
  project_id (state: State, payload) { state.project_id = payload; },
  status_ids (state: State, payload) { state.status_ids = payload; },
  owner_id (state: State, payload) { state.owner_id = payload; },
  user_group_id (state: State, payload) { state.user_group_id = payload; },
  tag_ids (state: State, payload) { state.tag_ids = payload; },
  contact_created_at (state: State, payload) { state.contact_created_at = payload; },
  offset (state: State, payload) { state.offset = payload; },

  order_by (state: State, payload) { state.order_by = payload; },
  order_direction (state: State, payload) { state.order_direction = payload; },
  /// //////////////////////////////////////////////////////////////////////////

  flush (state: State) { Object.assign(state, defaultState()); }
};

export default mutations;
