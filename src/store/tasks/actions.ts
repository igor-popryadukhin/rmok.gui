import Tasks, { TaskInterface } from '@/api/Tasks'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { TasksStateInterface } from './state'

const actions: ActionTree<TasksStateInterface, RootState> = {

  /**
   *
   * @param ctx
   * @param payload
   */
  async items ({ state, commit }, payload = null) {
    return new Promise<void>((resolve, reject) => {
      if (payload) {
        // Установить параметры, это позволит сохранить параметры последней загрузки
        commit('filter', Object.assign(state.filter, payload))
      }

      const offset = state.options.per_page * state.options.page - state.options.per_page

      const newParams: any = {
        count: state.options.per_page,
        offset
      }

      // Поиск по тексту
      if (state.filter.contact_id) {
        newParams.contact_id = state.filter.contact_id
      }

      // Поиск по тексту
      if (state.filter.q) {
        newParams.q = state.filter.q
      }

      if (state.filter.sort) {
        newParams.sort = state.filter.sort
      }

      // Статус контакта
      if (state.filter.status_id) {
        newParams.status_id = state.filter.status_id
      }

      // Статус Задачи
      if (state.filter.state) {
        newParams.state = state.filter.state
      }

      // Статус контакта
      if (state.filter.planned_for) {
        newParams.planned_for = state.filter.planned_for
      }

      new Tasks()
        .find<any, TaskInterface[]>(newParams)
        .then((response) => {
          commit('options_count', response.meta?.count)
          commit('options_pages', Math.ceil(response.meta?.count / state.options.per_page))
          commit('items', response.data)

          resolve()
        }).catch(reject)
    })
  },

  /**
   *
   * @param ctx
   */
  async pending_count ({ commit }) {
    return new Promise<void>((resolve) => {
      new Tasks()
        .count({ state: 'pending' })
        .then((response) => {
          commit('pending_count', response.data.count)
          resolve()
        })
    })
  },

  /**
   * Сбросить параметры запроса
   * @param commit
   */
  reset_filter ({ commit }) {
    commit('filter', {
      contact_id: 0,
      planned_for: 'all',
      q: null,
      sort: null,
      state: 'all',
      status_id: 0
    })
  },

  /**
   *
   * @param state
   * @param commit
   * @param payload
   */
  async sort ({ state, commit }) {
    return new Promise<void>((resolve) => {
      commit('items', state.items.sort((a: TaskInterface, b: TaskInterface) => {
        if (a.state === b.state) {
          return -1
        } else {
          return 0
        }
      }))
      resolve()
    })
  }

}

export default actions
