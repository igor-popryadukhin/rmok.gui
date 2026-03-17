import { ScenarioViewState } from './state';
import { MutationTree } from 'vuex';

export const mutations: MutationTree<ScenarioViewState> = {
  name (state, payload) { state.name = payload; },
  description (state, payload) { state.description = payload; },
  scenario (state, payload) { state.scenario = payload; },

  fill (state, payload) {
    state.id = payload.id;
    state.name = payload.name;
    state.description = payload.description;
    state.scenario = payload.scenario;
  }
};
