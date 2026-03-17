import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  filter_q (state: State) { return state.filter_q; },
  filter_offset (state: State) { return state.filter_offset; },

  all (state: State) {
    const obj: Record<string, unknown> = {};

    if (state.filter_q) {
      obj.q = state.filter_q;
    }

    if (state.filter_offset) {
      obj.offset = state.filter_offset;
    }

    return obj;
  }
};

export default getters;
