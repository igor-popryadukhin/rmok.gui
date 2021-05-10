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
  audio_player_volume (state, payload) { state.audio_player.volume = payload },

  date_time_format_short_time (state, payload) { state.date_time_format.short_time = payload },
  date_time_format_long_time (state, payload) { state.date_time_format.long_time = payload },
  date_time_format_short_date (state, payload) { state.date_time_format.short_date = payload },
  date_time_format_long_date (state, payload) { state.date_time_format.long_date = payload }
}

export default mutations
