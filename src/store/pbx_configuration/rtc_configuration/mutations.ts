import { State } from './state';
import { RTCConfiguration } from '@/api/interfaces/PBXConfiguration';

const mutations = {
  ice_candidate_pool_size (state: State, payload) { state.ice_candidate_pool_size = payload; },
  ice_servers (state: State, payload) { state.ice_servers = payload; },
  ice_transport_policy (state: State, payload) { state.ice_transport_policy = payload; },
  rtcp_mux_policy (state: State, payload) { state.rtcp_mux_policy = payload; },
  certificates (state: State, payload) { state.certificates = payload; },
  bundle_policy (state: State, payload) { state.bundle_policy = payload; },
  candidate_ready_timeout (state: State, payload) { state.candidate_ready_timeout = payload; },

  fill (state: State, payload: RTCConfiguration) {
    state.bundle_policy = payload?.bundle_policy || 'balanced';
    state.rtcp_mux_policy = payload?.rtcp_mux_policy || null;
    state.ice_servers = payload?.ice_servers || [];
    state.ice_transport_policy = payload?.ice_transport_policy || 'all';
    state.ice_candidate_pool_size = payload?.ice_candidate_pool_size || 0;
    state.certificates = payload?.certificates || [];
    state.candidate_ready_timeout = payload?.candidate_ready_timeout || 0;
  }
};

export default mutations;
