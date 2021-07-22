import { PBXConfigState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<PBXConfigState> = {
  login (state, payload) { state.login = payload },
  password (state, payload) { state.password = payload },
  server (state, payload) { state.server = payload },
  port (state, payload) { state.port = payload },
  display_name (state, payload) { state.display_name = payload }
}

export default mutations
