import { State } from './state'
import { MutationTree } from 'vuex'
import { RTCConfiguration } from '@/api/interfaces/PBXConfiguration'

const mutations: MutationTree<State> = {
  ice_candidate_pool_size (state, payload) { state.ice_candidate_pool_size = payload },
  ice_servers (state, payload) { state.ice_servers = payload },
  ice_transport_policy (state, payload) { state.ice_transport_policy = payload },
  rtcp_mux_policy (state, payload) { state.rtcp_mux_policy = payload },
  certificates (state, payload) { state.certificates = payload },
  bundle_policy (state, payload) { state.bundle_policy = payload },

  fill (state, payload: RTCConfiguration) {
    state.bundle_policy = payload?.bundle_policy || 'balanced'
    state.rtcp_mux_policy = payload?.rtcp_mux_policy || null
    state.ice_servers = payload?.ice_servers || []
    state.ice_transport_policy = payload?.ice_transport_policy || 'all'
    state.ice_candidate_pool_size = payload?.ice_candidate_pool_size || 0
    state.certificates = payload?.certificates || []
  }
}

export default mutations
