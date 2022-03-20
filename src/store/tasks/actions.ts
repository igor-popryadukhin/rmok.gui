import Tasks from '@/api/Tasks'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { TasksState } from './state'
import debounce from '@/utils/debounce'

const actions: ActionTree<TasksState, RootState> = {
  pending_count: debounce(async ({ commit }: any) => {
    commit('pending_count', await new Tasks().countPending())
  }, 1000),

  calculate: ({ commit }, payload) => {
    $axios.post('/tasks/count/calculate', payload)
      .then((response) => {
        commit('pending_items', response.data || [])
      })
  }
}

export default actions
