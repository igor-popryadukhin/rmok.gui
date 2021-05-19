import { FilterStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<FilterStateInterface> = {
  /**
   * Теги контактов
   *
   * @param state
   * @param payload
   */
  contact_tags (state, payload) { state.contact_tags = payload }
}

export default mutations
