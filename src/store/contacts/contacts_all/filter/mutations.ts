import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  projects (state: State, payload) { state.projects = payload },
  statuses (state: State, payload) { state.statuses = payload },
  users (state: State, payload) { state.users = payload },
  user_groups (state: State, payload) { state.user_groups = payload },
  tags (state: State, payload) { state.tags = payload },
  timezones (state: State, payload) { state.timezones = payload },
  /// //////////////////////////////////////////////////////////////////////////
  filter_q (state: State, payload) { state.filter_q = payload },
  filter_project (state: State, payload) { state.filter_project = payload },
  filter_statuses (state: State, payload) { state.filter_statuses = payload },
  filter_owner (state: State, payload) { state.filter_owner = payload },
  filter_user_group (state: State, payload) { state.filter_user_group = payload },
  filter_tags (state: State, payload) { state.filter_tags = payload },
  filter_contact_created_at (state: State, payload) { state.filter_contact_created_at = payload },
  filter_called (state: State, payload) { state.filter_called = payload },
  filter_offset (state: State, payload) { state.filter_offset = payload },
  filter_task (state, payload) { state.filter_task = payload },
  filter_timezone (state: State, payload) { state.filter_timezone = payload },

  order_by (state: State, payload) { state.order_by = payload },
  order_direction (state: State, payload) { state.order_direction = payload }
  /// //////////////////////////////////////////////////////////////////////////
}

export default mutations
