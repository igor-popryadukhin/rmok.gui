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
  filter_project_id (state: State, payload) { state.filter_project_id = payload },
  filter_status_ids (state: State, payload) { state.filter_status_ids = payload },
  filter_owner_id (state: State, payload) { state.filter_owner_id = payload },
  filter_user_group_id (state: State, payload) { state.filter_user_group_id = payload },
  filter_tag_ids (state: State, payload) { state.filter_tag_ids = payload },
  filter_contact_created_at (state: State, payload) { state.filter_contact_created_at = payload },
  filter_calling (state: State, payload) { state.filter_calling = payload },
  filter_offset (state: State, payload) { state.filter_offset = payload },
  filter_task (state, payload) { state.filter_task = payload },
  filter_timezone_id (state: State, payload) { state.filter_timezone_id = payload }
  /// //////////////////////////////////////////////////////////////////////////
}

export default mutations
