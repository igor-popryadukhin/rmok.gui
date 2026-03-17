import { State } from './state';
import { GetterTree } from 'vuex';
import { RootState } from '@/store';

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state?.id || 0; },
  name (state: State) { return state?.name || ''; },
  description (state: State) { return state?.description || ''; },
  scenario (state: State) { return state?.scenario || ''; },
  created_at (state: State) { return state?.created_at || 0; }
};

export default getters;
