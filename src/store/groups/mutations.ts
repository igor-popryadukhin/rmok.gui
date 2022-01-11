import { ProjectState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProjectState> = {
  scenario (state, payload) { state.scenario = payload }
}

export default mutations
