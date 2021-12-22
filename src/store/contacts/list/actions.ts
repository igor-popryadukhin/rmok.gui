import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactListState } from './state'
import Contact from '@/api/interfaces/Contact'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'
import dayjs from 'dayjs'

const cancelTokenSources: CancelTokenSource[] = []

function normalizeQuery (query: Record<string, string|number|Array<string|number>>) {
  const inner = Object.assign({}, query)

  if (!inner.q) { delete inner.q }
  if (!inner.project_id) { delete inner.project_id }
  if (!(Array.isArray(inner.status_ids) && inner.status_ids.length === 0)) { delete inner.status_ids }
  if (!inner.owner_id) { delete inner.owner_id }
  if (!inner.user_group_id) { delete inner.user_group_id }
  if (!(Array.isArray(inner.tag_ids) && inner.tag_ids.length > 0)) { delete inner.tag_ids }
  if (!inner.contact_created_at) { delete inner.contact_created_at }
  if (!inner.calling) { delete inner.calling }
  if (!inner.offset) { delete inner.offset }
  if (!inner.task) { delete inner.task }
  if (!inner.timezone) { delete inner.timezone }
  if (!inner.utc_offset) { delete inner.utc_offset }

  // Модифицирую формат даты
  if ('contact_created_at' in inner) {
    if (Array.isArray(inner.contact_created_at) && inner.contact_created_at.length === 2) {
      let contactCreatedAtStart = dayjs(inner.contact_created_at[0], 'YYYY-MM-DD')
      let contactCreatedAtEnd = dayjs(inner.contact_created_at[1], 'YYYY-MM-DD')

      contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
      contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

      if (contactCreatedAtStart.unix() > contactCreatedAtEnd.unix()) {
        inner.contact_created_at = `${contactCreatedAtEnd.unix()},${contactCreatedAtStart.unix()}`
      } else {
        inner.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      }
    } else {
      delete inner.contact_created_at
    }
  }

  return inner
}

const actions: ActionTree<ContactListState, RootState> = {
  fetch: ({ commit, state, getters, dispatch }: ActionContext<ContactListState, RootState>) => {
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
      $axios.post(`/autodialer/${id}/add-contacts`, {
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

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
