import { RootStateInterface } from '@/store'
import { SettingsStateInterface } from '@/store/settings/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SettingsStateInterface, RootStateInterface> = {
  navigation_drawer_mini (state: SettingsStateInterface) { return state.navigation_drawer.mini },
  audio_player_volume (state: SettingsStateInterface) { return state.audio_player.volume }
}

export default getters
