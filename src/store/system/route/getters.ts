import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  full_path (state: State) { return state.full_path; }
};

export default getters;
