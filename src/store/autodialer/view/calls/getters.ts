import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { State } from './state';

const getters: GetterTree<State, RootState> = {
  items (state: State) { return state.items; },
  items_total (state: State) { return state.items_total; },
  items_per_page (state: State) { return state.items_per_page; },
  items_callers (state: State) { return state.items_callers; },
  items_callers_total (state: State) { return state.items_callers_total; },
  items_selected (state: State) { return state.items_selected; },

  filter_offset (state: State) { return state.filter_offset || 0; }
};

export default getters;
