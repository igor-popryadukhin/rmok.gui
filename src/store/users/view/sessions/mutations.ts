import { defaultState, SessionsState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<SessionsState> = {
  items (state: SessionsState, payload) { state.items = payload; },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  flush (state: SessionsState) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
