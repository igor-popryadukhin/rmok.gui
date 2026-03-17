import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  permissions (state: State) { return state.permissions; }
};

export default getters;
