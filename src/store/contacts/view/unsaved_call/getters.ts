import { RootState } from '@/store';
import { UnsavedCallState } from './state';

import { GetterTree } from 'vuex';

const getters: GetterTree<UnsavedCallState, RootState> = {
  data_call_id (state: UnsavedCallState) { return state.data_call_id; },
  data_status_id (state: UnsavedCallState) { return state.data_status_id; },
  data_contact_id (state: UnsavedCallState) { return state.data_contact_id; },
  data_contact_history_id (state: UnsavedCallState) { return state.data_contact_history_id; },
  data_contact_name (state: UnsavedCallState) { return state.data_contact_name; },
  data_direction (state: UnsavedCallState) { return state.data_direction; },
  data_comment (state: UnsavedCallState) { return state.data_comment; },

  persists (state: UnsavedCallState) { return state.persists; },
  unsaved (state: UnsavedCallState) { return state.unsaved; }
};

export default getters;
