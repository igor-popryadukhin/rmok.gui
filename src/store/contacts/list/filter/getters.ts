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
  timezones (state: State) { return state.timezones },
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
  filter_timezone_id (state: State) { return state.filter_timezone_id },

  order_by (state: State) { return state.order_by },
  order_direction (state: State) { return state.order_direction },

  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    const obj: Record<string, any> = {}

    if (state.filter_q) {
      obj.q = state.filter_q
    }

    if (state.filter_project_id) {
      obj.project_id = state.filter_project_id
    }

    if ((state.filter_status_ids || []).length) {
      obj.status_ids = state.filter_status_ids
    }

    if (state.filter_user_group_id) {
      obj.user_group_id = state.filter_user_group_id
    }

    if (state.filter_owner_id) {
      obj.owner_id = state.filter_owner_id
    }

    if (state.filter_task) {
      obj.task = state.filter_task
    }

    if (state.filter_calling) {
      obj.calling = state.filter_calling
    }

    if ((state.filter_tag_ids || []).length) {
      obj.tag_ids = state.filter_tag_ids
    }

    if (state.filter_timezone_id) {
      obj.timezone_id = state.filter_timezone_id
    }

    if (state.filter_contact_created_at) {
      obj.contact_created_at = state.filter_contact_created_at
    }

    if (state.filter_offset) {
      obj.offset = state.filter_offset
    }

    if (state.order_by && state.order_direction) {
      obj.order_by = state.order_by
      obj.order_direction = state.order_direction
    }

    return obj
  }
  /// //////////////////////////////////////////////////////////////////////////
}

export default getters
