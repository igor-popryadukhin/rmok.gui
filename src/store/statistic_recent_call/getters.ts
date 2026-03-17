import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  process_loading (state: State) { return state.process_loading; },
  total_calls (state: State) { return state.total_calls; },
  client_calls (state: State) { return state.client_calls; },
  history_offset (state: State) { return state.history_offset; },
  history (state: State) { return state.history; }
};

export default getters;
