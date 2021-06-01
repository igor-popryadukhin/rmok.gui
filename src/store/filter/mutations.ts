import { FilterStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<FilterStateInterface> = {
  /**
   * Теги контактов
   *
   * @param state
   * @param payload
   */
  contact_tags (state, payload) { state.contact_tags = payload },

  /**
   * Статусы
   * @param state
   * @param payload
   */
  statuses (state, payload) { state.statuses = payload }
}

export default mutations
