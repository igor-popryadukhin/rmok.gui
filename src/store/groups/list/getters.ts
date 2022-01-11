import { RootState } from '@/store'
import { ProjectsListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectsListState, RootState> = {
  per_page (state: ProjectsListState) { return state.per_page },
  total (state: ProjectsListState) { return state.total },
  items (state: ProjectsListState) { return state.items },
  items_fetching (state: ProjectsListState) { return state.items_fetching }
}

export default getters
