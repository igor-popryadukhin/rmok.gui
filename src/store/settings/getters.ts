import { RootState } from '@/store';
import { SettingsStateInterface } from '@/store/settings/state';
import { GetterTree } from 'vuex';

const getters: GetterTree<SettingsStateInterface, RootState> = {
  navigation_drawer_mini (state: SettingsStateInterface) { return state.navigation_drawer.mini; },
  navigation_drawer_width (state: SettingsStateInterface) { return state.navigation_drawer.width; },
  container_width (state: SettingsStateInterface) { return state.container_width; },

  audio_player_volume (state: SettingsStateInterface) { return state.audio_player.volume; },
  date_time_format (state: SettingsStateInterface) { return state.date_time_format; },
  contact_list (state: SettingsStateInterface) { return state.contact_list; },
  tooltip (state: SettingsStateInterface) { return state.tooltip; },

  // RTCConfiguration
  pc_config (state: SettingsStateInterface) { return state.pc_config; }, // Все параметры
  pc_config_ice_candidate_pool_size (state: SettingsStateInterface) { return state.pc_config.iceCandidatePoolSize; },
  pc_config_ice_servers (state: SettingsStateInterface) { return state.pc_config.iceServers; },
  pc_config_ice_transport_policy (state: SettingsStateInterface) { return state.pc_config.iceTransportPolicy; },
  pc_config_bundle_policy (state: SettingsStateInterface) { return state.pc_config.bundlePolicy; },
  pc_config_rtcp_mux_policy (state: SettingsStateInterface) { return state.pc_config.rtcpMuxPolicy; },
  pc_config_certificates (state: SettingsStateInterface) { return state.pc_config.certificates; },

  // Параметры подключения телефонии
  pbx_config (state: SettingsStateInterface) { return state.pbx_config; },

  vue_keep_alive (state: SettingsStateInterface) { return state.vue_keep_alive; }
};

export default getters;
