import { TasksListState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<TasksListState> = {
  loading (state: TasksListState, payload) { state.loading = payload },
  total (state: TasksListState, payload) { state.total = payload },
  items (state: TasksListState, payload) { state.items = payload },
  items_fetching (state: TasksListState, payload) { state.items_fetching = payload },

  /** Сброс состояния */
  flush (state: TasksListState) {
    Object.assign(state, defaultState())
  }
}

export default mutations
