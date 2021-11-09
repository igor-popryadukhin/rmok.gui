import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  ice_candidate_pool_size (state, payload) { state.ice_candidate_pool_size = payload },
  ice_servers (state, payload) { state.ice_servers = payload },
  ice_transport_policy (state, payload) { state.ice_transport_policy = payload },
  rtcp_mux_policy (state, payload) { state.rtcp_mux_policy = payload },
  certificates (state, payload) { state.certificates = payload },
  bundle_policy (state, payload) { state.bundle_policy = payload }
}

export default mutations
