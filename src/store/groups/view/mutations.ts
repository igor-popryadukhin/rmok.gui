import { ProjectsViewState, defaultState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ProjectsViewState> = {
  project_name (state: ProjectsViewState, payload) { state.project_name = payload; },
  project_description (state: ProjectsViewState, payload) { state.project_description = payload; },
  project_scenario (state: ProjectsViewState, payload) { state.project_scenario = payload; },
  project_statuses (state: ProjectsViewState, payload) { state.project_statuses = payload; },

  fetching (state: ProjectsViewState, payload) { state.fetching = payload; },
  flush (state: ProjectsViewState) { Object.assign(state, defaultState()); }
};

export default mutations;
