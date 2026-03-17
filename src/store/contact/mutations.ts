import defaultState, { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  id (state, payload) { state.id = payload; },
  first_name (state, payload) { state.first_name = payload; },
  last_name (state, payload) { state.last_name = payload; },
  middle_name (state, payload) { state.middle_name = payload; },
  contact_name (state, payload) { state.contact_name = payload; },
  city (state, payload) { state.city = payload; },
  region (state, payload) { state.region = payload; },
  address (state, payload) { state.address = payload; },
  tz (state, payload) { state.tz = payload; },
  emails (state, payload) { state.emails = payload; },
  phones (state, payload) { state.phones = payload; },
  tags (state, payload) { state.tags = payload; },
  owner (state, payload) { state.owner = payload; },
  project (state, payload) { state.project = payload; },
  notes (state, payload) { state.notes = payload; },
  default_phone (state, payload) { state.default_phone = payload; },
  created_at (state, payload) { state.created_at = payload; },

  /** Сбрасывает состояние */
  reset_state (state) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
