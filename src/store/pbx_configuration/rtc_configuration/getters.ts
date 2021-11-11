import { State } from './state'

const getters = {
  rtcp_mux_policy (state: State) { return state.rtcp_mux_policy },
  ice_transport_policy (state: State) { return state.ice_transport_policy },
  ice_servers (state: State) { return state.ice_servers },
  bundle_policy (state: State) { return state.bundle_policy },
  certificates (state: State) { return state.certificates },
  ice_candidate_pool_size (state: State) { return state.ice_candidate_pool_size }
}

export default getters
