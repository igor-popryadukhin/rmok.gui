import { RootState } from '@/store';
import { State } from './state';

import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  unsaved (state: State) { return state.unsaved; }
};

export default getters;
