import { RootState } from '@/store'
import { ProjectsViewState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectsViewState, RootState> = {
  project_name (state: ProjectsViewState) { return state.project_name },
  project_description (state: ProjectsViewState) { return state.project_description },
  project_scenario (state: ProjectsViewState) { return state.project_scenario },

  fetching (state: ProjectsViewState) { return state.fetching }
}

export default getters
