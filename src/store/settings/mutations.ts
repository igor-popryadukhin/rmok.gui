import { SettingsStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<SettingsStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  navigation_drawer_mini (state, payload) { state.navigation_drawer.mini = payload }
}

export default mutations
