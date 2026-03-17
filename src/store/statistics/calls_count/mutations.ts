import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  items (state: State, payload) { state.items = payload; },
  items_fetching (state: State, payload) { state.items_fetching = payload; },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  flush (state: State) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
