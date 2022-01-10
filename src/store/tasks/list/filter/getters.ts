import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  filter_q (state: State) { return state.filter_q },
  filter_status_id (state: State) { return state.filter_status_id },
  filter_planned_for (state: State) { return state.filter_planned_for },

  statuses (state: State) { return state.statuses },

  all (state: State) {
    const obj: Record<string, unknown> = {}

    if (state.filter_q) {
      obj.q = state.filter_q
    }

    if (state.filter_status_id) {
      obj.status_id = state.filter_status_id
    }

    if (state.filter_planned_for) {
      obj.planned_for = state.filter_planned_for
    }

    return obj
  }
}

export default getters
