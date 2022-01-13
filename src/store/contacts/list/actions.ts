import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactListState } from './state'
import Contact from '@/api/interfaces/Contact'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactListState, RootState> = {
  fetch: ({ commit, state, getters }: ActionContext<ContactListState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      const query: Record<string, string|number|Array<string|number>> = getters['filter/all']

      query.count = state.per_page

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

  add_to_autodialer: ({ state, getters }: ActionContext<ContactListState, RootState>, id: number) => {
    const filter_contacts: Record<string, string|number|Array<string|number>> = getters['filter/all']

    if ('count' in filter_contacts) { delete filter_contacts.count }
    if ('offset' in filter_contacts) { delete filter_contacts.offset }

    if (state.items_selected.length > 0) {
      filter_contacts.ids = state.items_selected
    }

    return new Promise<boolean>((resolve, reject) => {
      $axios.post(`/auto-dialers/${id}/add-contacts`, {
        filter_contacts
      }).then((response: AxiosResponse) => {
        if (response.status !== 202) {
          throw new Error('Ошибка')
        }

        resolve(true)
      }).catch(reject)
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

  unselect_all: ({ commit }) => {
    commit('items_selected', [])
    commit('selected_all', false)
  },

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
