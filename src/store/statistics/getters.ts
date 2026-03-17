import { RootState } from '@/store';
import { State } from './state';

import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id; }
};

export default getters;
