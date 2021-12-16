import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactListState } from './state'
import Contact from '@/api/interfaces/Contact'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'
import dayjs from 'dayjs'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactListState, RootState> = {
  fetch: ({ commit, state, getters, dispatch }: ActionContext<ContactListState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      const query: Record<string, string|number|Array<string|number>> = Object.assign({}, getters['filter/all'])

      if (!query.q) { delete query.q }
      if (!query.project_id) { delete query.project_id }
      if (!(Array.isArray(query.status_ids) && query.status_ids.length > 0)) { delete query.status_ids }
      if (!query.owner_id) { delete query.owner_id }
      if (!query.user_group_id) { delete query.user_group_id }
      if (!(Array.isArray(query.tag_ids) && query.tag_ids.length > 0)) { delete query.tag_ids }
      if (!query.contact_created_at) { delete query.contact_created_at }
      if (!query.calling) { delete query.calling }
      if (!query.offset) { delete query.offset }
      if (!query.task) { delete query.task }
      if (!query.timezone) { delete query.timezone }

      query.count = state.per_page

      // Модифицирую формат даты
      if ('contact_created_at' in query) {
        if (Array.isArray(query.contact_created_at) && query.contact_created_at.length === 2) {
          let contactCreatedAtStart = dayjs(query.contact_created_at[0], 'YYYY-MM-DD')
          let contactCreatedAtEnd = dayjs(query.contact_created_at[1], 'YYYY-MM-DD')

          contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
          contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

          if (contactCreatedAtStart.unix() > contactCreatedAtEnd.unix()) {
            query.contact_created_at = `${contactCreatedAtEnd.unix()},${contactCreatedAtStart.unix()}`
          } else {
            query.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
          }
        } else {
          delete query.contact_created_at
        }
      }

      const cancelTokenSource = axios.CancelToken.source()
      cancelTokenSources.push(cancelTokenSource)

      setTimeout(() => (commit('loading', true)), 0)

      $axios.get('/contacts', {
        params: query,
        cancelToken: cancelTokenSource.token
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('total', response.data?.meta?.count || 0)
          commit('items', response.data?.data || [])
          resolve()
        }
      }).catch(reject).finally(() => (commit('loading', false)))
    })
  },

  /**
   * Отменяет загрузку контактов
   */
  cancelFetch: () => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }
  },

  /**
   * Выделяет все контакты в таблице
   * @param commit
   * @param state
   */
  selected_all: ({ commit, dispatch }) => {
    dispatch('selected_all_in_page')
    commit('selected_all', true)
  },

  /**
   * Выделяет все контакты на странице
   * @param commit
   * @param state
   */
  selected_all_in_page: ({ commit, state }) => {
    // Копирую ранее выбранные идентификаторы
    const contactIds: number[] = state.items_selected.map((id: number) => id)
    state.items.forEach((e: Contact) => {
      // Добавляю в список если не существует
      if (!contactIds.includes(e.id)) {
        contactIds.push(e.id)
      }
    })
    // Фиксирую состояние
    commit('items_selected', contactIds)
  },

  /**
   * Отменяет выделение на текущей странице
   * @param commit
   * @param state
   */
  unselect_all_in_page: ({ commit, state }) => {
    const contactIds: number[] = state.items_selected.map((id: number) => id)

    state.items.forEach((e: Contact) => {
      const index = contactIds.findIndex((id) => id === e.id)
      if (index > -1) {
        contactIds.splice(index, 1)
      }
    })
    // Фиксирую состояние
    commit('items_selected', contactIds)
  },

  unselect: ({ commit }) => {
    commit('items_selected', [])
    commit('selected_all', false)
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
