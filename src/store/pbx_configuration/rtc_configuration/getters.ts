import { GetterTree } from 'vuex'
import { State } from './state'
import { RootState } from '@/store'

const getters: GetterTree<State, RootState> = {
  rtcp_mux_policy (state) { return state.rtcp_mux_policy },
  ice_transport_policy (state) { return state.ice_transport_policy },
  ice_servers (state) { return state.ice_servers },
  bundle_policy (state) { return state.bundle_policy },
  certificates (state) { return state.certificates },
  ice_candidate_pool_size (state) { return state.ice_candidate_pool_size }
}

export default getters
