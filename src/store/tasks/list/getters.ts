import { RootState } from '@/store'
import { TasksListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<TasksListState, RootState> = {
  loading (state: TasksListState) { return state.loading },
  per_page (state: TasksListState) { return state.per_page },
  total (state: TasksListState) { return state.total },
  items (state: TasksListState) { return state.items },
  items_fetching (state: TasksListState) { return state.items_fetching }
}

export default getters
