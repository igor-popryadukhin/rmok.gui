import { SymfonyStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<SymfonyStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  call_collection (state, payload) {
    state.call_collection.push(payload)
  }
}

export default mutations
