import { State } from './state';
import { MutationTree } from 'vuex';
import Project from '@/api/interfaces/Project';

const mutations: MutationTree<State> = {
  id (state: State, payload) { state.id = payload; },
  name (state: State, payload) { state.name = payload; },
  description (state: State, payload) { state.description = payload; },
  scenario (state: State, payload) { state.scenario = payload; },
  created_at (state: State, payload) { state.created_at = payload; },

  fill (state: State, payload: Project) {
    state.id = payload.id;
    state.name = payload.name;
    state.description = payload.description;
    state.scenario = payload.scenario;
    state.created_at = payload.created_at;
  }
};

export default mutations;
