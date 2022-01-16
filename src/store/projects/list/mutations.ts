import { defaultState, ProjectsListState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProjectsListState> = {
  total (state: ProjectsListState, payload) { state.total = payload },
  items (state: ProjectsListState, payload) { state.items = payload },
  items_fetching (state: ProjectsListState, payload) { state.items_fetching = payload },

  flush (state: ProjectsListState) { Object.assign(state, defaultState()) }
}

export default mutations
