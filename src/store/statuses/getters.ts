import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { StatusesState } from './state';

const getters: GetterTree<StatusesState, RootState> = {
  items (state) { return state.items; },
  items_fetching (state) { return state.items_fetching; }
};

export default getters;
