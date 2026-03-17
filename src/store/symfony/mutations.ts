import { SymfonyStateInterface } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<SymfonyStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  call_collection (state, payload) {
    if (state.call_collection.length > 50) {
      state.call_collection.splice(9, state.call_collection.length);
    }

    state.call_collection.push(payload);
  }
};

export default mutations;
