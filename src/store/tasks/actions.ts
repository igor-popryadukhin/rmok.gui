import Tasks from '@/api/Tasks'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { TasksState } from './state'
import debounce from '@/utils/debounce'

const actions: ActionTree<TasksState, RootState> = {
  pending_count: debounce(async ({ commit }: any) => {
    commit('pending_count', await new Tasks().countPending())
  }, 1000)

}

export default actions
