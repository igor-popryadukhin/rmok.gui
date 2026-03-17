import { RootState } from '@/store';
import { ProjectsViewMembersState } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<ProjectsViewMembersState, RootState> = {
  items (state: ProjectsViewMembersState) { return state.items; },
  items_count (state: ProjectsViewMembersState) { return state.items_count; },

  fetching (state: ProjectsViewMembersState) { return state.fetching; }
};

export default getters;
