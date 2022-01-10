import { RootState } from '@/store'
import { TasksState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<TasksState, RootState> = {
  pending_items (state) { return state.pending_items }
}

export default getters
