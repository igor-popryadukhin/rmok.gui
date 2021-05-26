import { RootStateInterface } from '@/store'
import { ProjectStateInterface } from '@/store/project/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ProjectStateInterface, RootStateInterface> = {
  current (state: ProjectStateInterface) { return state.current },
  available (state: ProjectStateInterface) { return state.available }
}

export default getters
