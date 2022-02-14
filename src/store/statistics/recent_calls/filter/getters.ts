import { RootState } from '@/store'
import { State, Tag } from './state'
import { GetterTree } from 'vuex'

export interface Getters {
  tag_ids (state: State): number[]
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
  period (state: State) { return state.period },
  q (state: State) { return state.q },
  project_id (state: State) { return state.project_id },
  status_ids (state: State) { return state.status_ids },
  owner_id (state: State) { return state.owner_id },
  user_group_id (state: State) { return state.user_group_id },
  tag_ids (state: State) { return state.tag_ids },
  contact_created_at (state: State) { return state.contact_created_at },
  offset (state: State) { return state.offset || 0 },

  order_by (state: State) { return state.order_by },
  order_direction (state: State) { return state.order_direction },
  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    const obj: Record<string, unknown> = {}

    if (state.period) {
      obj.period = state.period
    }

    if (state.project_id) {
      obj.project_id = state.project_id
    }

    if ((state.status_ids || []).length) {
      obj.status_ids = state.status_ids
    }

    if (state.user_group_id) {
      obj.user_group_id = state.user_group_id
    }

    if (state.owner_id) {
      obj.owner_id = state.owner_id
    }

    if ((state.tag_ids || []).length) {
      obj.tag_ids = state.tag_ids
    }

    if (state.contact_created_at) {
      obj.contact_created_at = state.contact_created_at
    }

    if (state.offset) {
      obj.offset = state.offset
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
