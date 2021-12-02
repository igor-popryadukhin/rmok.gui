import { RootState } from '@/store'
import { State, Tag } from './state'
import { GetterTree } from 'vuex'

export interface Getters {
  filter_tag_ids (state: State): number[]
  tags (state: State): Tag[]
}

const getters: GetterTree<State, RootState> & Getters = {
  projects (state: State) { return state.projects },
  statuses (state: State) { return state.statuses },
  users (state: State) { return state.users },
  user_groups (state: State) { return state.user_groups },
  tags (state: State) { return state.tags },
  /// //////////////////////////////////////////////////////////////////////////
  filter_q (state: State) { return state.filter_q },
  filter_project_id (state: State) { return state.filter_project_id },
  filter_status_ids (state: State) { return state.filter_status_ids },
  filter_owner_id (state: State) { return state.filter_owner_id },
  filter_user_group_id (state: State) { return state.filter_user_group_id },
  filter_tag_ids (state: State) { return state.filter_tag_ids },
  filter_contact_created_at (state: State) { return state.filter_contact_created_at },
  filter_calling (state: State) { return state.filter_calling },
  filter_offset (state: State) { return state.filter_offset || 0 },
  filter_task (state) { return state.filter_task },
  filter_utc_offset (state: State) { return state.filter_utc_offset },
  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    return {
      q: state.filter_q || null,
      project_id: state.filter_project_id || 0,
      status_ids: state.filter_status_ids || [],
      owner_id: state.filter_owner_id || 0,
      user_group_id: state.filter_user_group_id || 0,
      tag_ids: state.filter_tag_ids || [],
      contact_created_at: state.filter_contact_created_at || 0,
      calling: state.filter_calling || null,
      offset: state.filter_offset || 0,
      task: state.filter_task || null,
      utc_offset: state.filter_utc_offset || null
    }
  }
  /// //////////////////////////////////////////////////////////////////////////
}

export default getters
