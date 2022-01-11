import { ProjectsViewPeopleState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProjectsViewPeopleState> = {
  items (state: ProjectsViewPeopleState, payload) { state.items = payload },
  items_count (state: ProjectsViewPeopleState, payload) { state.items_count = payload },

  fetching (state: ProjectsViewPeopleState, payload) { state.fetching = payload },
  flush (state: ProjectsViewPeopleState) { Object.assign(state, defaultState()) }
}

export default mutations
