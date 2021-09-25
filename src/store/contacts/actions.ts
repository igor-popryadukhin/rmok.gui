import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsState } from './state'
import { Contacts } from '@/api/Contacts'
import Contact from '@/api/interfaces/Contact'

const actions: ActionTree<ContactsState, RootState> = {
  items: ({ commit, state }: ActionContext<ContactsState, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      commit('process_loading', true)
      new Contacts()
        .find(Object.assign(params, { count: state.per_page }))
        .then((response) => {
          commit('total', response.meta?.count || 0)
          commit('items', response.data)
          resolve()
        }).catch(reject)
        .finally(() => (commit('process_loading', false)))
    })
  },

  /**
   * Выделяет все контакты в таблице
   * @param commit
   * @param state
   */
  selected_all: ({ commit, state }) => {
    // Копирую ранее выбранные идентификаторы
    const contactIds: number[] = state.selected.map((id: number) => id)
    state.items.forEach((e: Contact) => {
      // Добавляю в список если не существует
      if (!contactIds.includes(e.id)) {
        contactIds.push(e.id)
      }
    })
    // Фиксирую состояние
    commit('selected', contactIds)
    commit('selected_all', true)
  },

  unselect: ({ commit }) => {
    commit('selected', [])
    commit('selected_all', false)
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
