import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { Contacts } from '@/api/Contacts'

const actions: ActionTree<State, RootState> = {
  /**
   * Загружает с сервера список контактов.
   *
   * @param commit
   * @param state
   * @param params
   */
  items: ({ commit, state }, params = {}) => {
    return new Promise<void>((resolve) => {
      commit('process_loading', true)
      new Contacts()
        .find(Object.assign(params, { queue_leads: 1 }))
        .then((response) => {
          const count = response.meta?.count || 0

          commit('total', count) // Количество доступных элементов
          commit('items', response.data)

          if (state.offset > 0) { commit('offset', 0) } // Сбрасывает смещение, связан с методом items_more

          if (!state.more_available && count > 0) {
            commit('more_available', true) // Говорим, что ещё есть доступные элементы.
          }

          resolve()
        }).finally(() => (commit('process_loading', false)))
    })
  },

  /**
   * Добавляет в хранилище дополнительные элементы с сервера.
   *
   * @param commit
   * @param state
   * @param params
   */
  items_more: ({ commit, state }) => {
    return new Promise<void>((resolve) => {
      const perPage = 50

      if (state.offset >= state.total - perPage) {
        commit('more_available', false)
        return
      }

      commit('process_loading', true)
      commit('offset', state.offset + perPage)
      new Contacts()
        .find({ fields: 'project,owner', queue_leads: 1, offset: state.offset })
        .then((response) => {
          commit('total', response.meta?.count || 0)

          const itemsBuf = state.items.map((e) => e)

          response.data.forEach((e) => {
            if (itemsBuf.findIndex((e1) => e1.id === e.id) === -1) {
              itemsBuf.push(e)
            }
          })
          commit('items', itemsBuf)

          if (response.data.length === 0) {
            commit('more_available', false)
          }

          resolve()
        }).finally(() => (commit('process_loading', false)))
    })
  },

  /**
   * Удаляет из локального хранилища используя идентификатор контакта.
   * Так же уменьшает общее количество.
   *
   * Идемпотентный метод.
   *
   * @param commit
   * @param state
   * @param id
   */
  items_remove_from_store: ({ commit, state }, id: number) => {
    const foundIndex = state.items.findIndex((e) => e.id === id)

    if (foundIndex > -1) {
      const oldItems = state.items.map((e) => e)
      oldItems.splice(foundIndex, 1)

      commit('items', oldItems)
      commit('total', state.total - 1)
    }
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
