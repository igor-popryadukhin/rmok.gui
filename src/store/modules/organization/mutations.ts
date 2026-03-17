import { State } from './state';
import { MutationTree } from 'vuex';
import Organization from '@/api/interfaces/Organization';

const mutations: MutationTree<State> = {
  id (state, payload) { state.id = payload; },
  name (state, payload) { state.name = payload; },

  fill (state, payload: Organization) {
    state.id = payload.id;
    state.name = payload.name;
  }
};

export default mutations;
