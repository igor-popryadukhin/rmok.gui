import { RootStateInterface } from '@/store'
import { SettingsStateInterface } from '@/store/settings/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SettingsStateInterface, RootStateInterface> = {
  navigation_drawer_mini (state: SettingsStateInterface) { return state.navigation_drawer.mini }
}

export default getters
