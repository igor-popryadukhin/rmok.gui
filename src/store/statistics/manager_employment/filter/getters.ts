import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {

  period (state: State) { return state.period },
  project (state: State) { return state.project },

  all (state: State) {
    const obj: Record<string, unknown> = {}

    if (state.period) {
      obj.period = state.period
    }

    if (state.project) {
      obj.project_id = state.project.id
    }

    return obj
  }
}

export default getters
