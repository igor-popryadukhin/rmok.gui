import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  filter_width (state: State) { return state.filter_width; }
};

export default getters;
