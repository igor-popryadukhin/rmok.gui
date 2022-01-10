import { RootState } from '@/store'
import { ProjectsViewPeopleState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectsViewPeopleState, RootState> = {
  items (state: ProjectsViewPeopleState) { return state.items },
  items_count (state: ProjectsViewPeopleState) { return state.items_count },

  fetching (state: ProjectsViewPeopleState) { return state.fetching }
}

export default getters
