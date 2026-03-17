import { RootState } from '@/store';
import { State } from './state';

import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  contact_history_id (state: State) { return state.contact_history_id; },
  contact_id (state: State) { return state.contact_id; },
  contact_name (state: State) { return state.contact_name; },
  status_id (state: State) { return state.status_id; },
  call_id (state: State) { return state.call_id; },
  direction (state: State) { return state.direction; },
  comment (state: State) { return state.comment; }
};

export default getters;
