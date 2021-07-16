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
  date_time_format_long_date (state, payload) { state.date_time_format.long_date = payload },

  contact_list_count_per_page (state, payload) { state.contact_list.count_per_page = payload },

  // RTCConfiguration
  pc_config_ice_candidate_pool_size (state, payload) { state.pc_config.iceCandidatePoolSize = payload },
  pc_config_ice_servers (state, payload) { state.pc_config.iceServers = payload },
  pc_config_ice_transport_policy (state, payload) { state.pc_config.iceTransportPolicy = payload },
  pc_config_bundle_policy (state, payload) { state.pc_config.bundlePolicy = payload },
  pc_config_rtcp_mux_policy (state, payload) { state.pc_config.rtcpMuxPolicy = payload },
  pc_config_certificates (state, payload) { state.pc_config.certificates = payload }
}

export default mutations
