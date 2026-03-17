import { ProjectsViewMembersState, defaultState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ProjectsViewMembersState> = {
  items (state: ProjectsViewMembersState, payload) { state.items = payload; },
  items_count (state: ProjectsViewMembersState, payload) { state.items_count = payload; },

  fetching (state: ProjectsViewMembersState, payload) { state.fetching = payload; },
  flush (state: ProjectsViewMembersState) { Object.assign(state, defaultState()); }
};

export default mutations;
