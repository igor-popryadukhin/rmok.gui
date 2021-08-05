import { RootState } from '@/store'
import { TasksState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<TasksState, RootState> = {
  pending_count (state) { return state.pending_count }
}

export default getters
