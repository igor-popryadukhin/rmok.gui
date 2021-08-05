import Tasks from '@/api/Tasks'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { TasksState } from './state'

const actions: ActionTree<TasksState, RootState> = {
  async pending_count ({ commit }) {
    commit('pending_count', await new Tasks().countPending())
  }

}

export default actions
