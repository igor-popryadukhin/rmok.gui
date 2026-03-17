import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  activity (state: State, payload) { state.activity = payload; },
  types (state: State, payload) { state.types = payload; },
  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  flush (state: State) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
