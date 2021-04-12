import { TasksStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<TasksStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  pending_count (state, payload: number) {
    state.pending_count = payload
  },

  /**
   *
   * @param state
   * @param payload
   */
  options_count (state, payload: number) {
    state.options.count = payload
  },

  /**
   *
   * @param state
   * @param payload
   */
  options_pages (state, payload: number) {
    state.options.pages = payload
  },

  /**
   *
   * @param state
   * @param payload
   */
  options_page (state, payload: number) {
    state.options.page = payload
  },

  /**
   * Параметры фильтров
   *
   * @param state
   * @param payload
   */
  filter (state, payload) { state.filter = payload },

  /**
   *
   * @param state
   * @param payload
   */
  filter_planned_for (state, payload) { state.filter.planned_for = payload },

  /**
   * Идентификатор статуса
   *
   * @param state
   * @param payload
   */
  filter_status_id (state, payload) { state.filter.status_id = payload },

  /**
   * Элементы задач
   *
   * @param state
   * @param payload
   */
  items (state, payload) {
    state.items = payload
  }
}

export default mutations
