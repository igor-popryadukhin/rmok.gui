import { RootStateInterface } from '@/store'
import { ProjectStateInterface } from '@/store/project/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectStateInterface, RootStateInterface> = {
  id (state: ProjectStateInterface) { return state.id },
  name (state: ProjectStateInterface) { return state.name },
  scenario (state: ProjectStateInterface) { return state.scenario },
  statuses (state: ProjectStateInterface) { return state.statuses },
  created_at (state: ProjectStateInterface) { return state.created_at }
}

export default getters
