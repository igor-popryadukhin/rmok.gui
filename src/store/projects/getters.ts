import { RootState } from '@/store'
import { ProjectState } from '@/store/project/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectState, RootState> = {
  scenario (state: ProjectState) { return state.scenario }
}

export default getters
