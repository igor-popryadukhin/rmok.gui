import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  filter_q (state: State) { return state.filter_q },
  filter_status_id (state: State) { return state.filter_status_id },
  filter_state (state: State) { return state.filter_state },
  filter_planned_for (state: State) { return state.filter_planned_for },
  filter_offset (state: State) { return state.filter_offset },

  all (state: State) {
    const obj: Record<string, unknown> = {}

    if (state.filter_q) {
      obj.q = state.filter_q
    }

    if (state.filter_status_id) {
      obj.status_id = state.filter_status_id
    }

    if (state.filter_state) {
      obj.state = state.filter_state
    }

    if (state.filter_planned_for) {
      obj.planned_for = state.filter_planned_for
    }

    if (state.filter_offset) {
      obj.offset = state.filter_offset
    }

    return obj
  }
}

export default getters
