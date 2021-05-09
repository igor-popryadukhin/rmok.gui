import { SettingsStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<SettingsStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  navigation_drawer_mini (state, payload) { state.navigation_drawer.mini = payload },

  /**
   * Громкость аудио плеера
   * @param state
   * @param payload
   */
  audio_player_volume (state, payload) { state.audio_player.volume = payload }
}

export default mutations
