import { RootStateInterface } from '@/store'
import { SettingsStateInterface } from '@/store/settings/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SettingsStateInterface, RootStateInterface> = {
  navigation_drawer_mini (state: SettingsStateInterface) { return state.navigation_drawer.mini },
  audio_player_volume (state: SettingsStateInterface) { return state.audio_player.volume },
  date_time_format (state: SettingsStateInterface) { return state.date_time_format },
  contact_list (state: SettingsStateInterface) { return state.contact_list },
  tooltip (state: SettingsStateInterface) { return state.tooltip }
}

export default getters
