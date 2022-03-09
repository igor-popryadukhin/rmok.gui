import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  period (state: State) { return state.period },
  project (state: State) { return state.project },
  statuses (state: State) { return state.statuses },
  owner (state: State) { return state.owner },
  user_group (state: State) { return state.user_group },
  tags (state: State) { return state.tags },
  contact_created_at (state: State) { return state.contact_created_at },
  offset (state: State) { return state.offset || 0 },
  timezone (state: State) { return state.timezone },

  order_by (state: State) { return state.order_by },
  order_direction (state: State) { return state.order_direction },
  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    const obj: Record<string, unknown> = {}

    if (state.period) {
      obj.period = state.period
    }

    if (state.project) {
      obj.project_id = state.project.id
    }

    if (Array.isArray(state.statuses) && state.statuses.length) {
      obj.status_ids = state.statuses.map((e) => e.id)
    }

    if (state.user_group) {
      obj.user_group_id = state.user_group.id
    }

    if (state.owner) {
      obj.owner_id = state.owner.id
    }

    if (Array.isArray(state.tags) && state.tags.length) {
      obj.tag_ids = state.tags.map((e) => e.id)
    }

    if (state.timezone) {
      obj.timezone_id = state.timezone.id
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
