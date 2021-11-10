import { State } from './state'
import { MutationTree } from 'vuex'
import { Credentials } from '@/api/interfaces/PBXConfiguration'

const mutations: MutationTree<State> = {
  login (state, payload) { state.login = payload },
  password (state, payload) { state.password = payload },
  server (state, payload) { state.server = payload },
  schema (state, payload) { state.schema = payload },
  port (state, payload) { state.port = payload },
  display_name (state, payload) { state.display_name = payload },

  fill (state, payload: Credentials) {
    state.schema = payload?.schema || 'sww'
    state.server = payload?.server || ''
    state.port = payload?.port || 8089
    state.display_name = payload?.display_name || ''
    state.login = payload?.login || ''
    state.password = payload?.password || ''
  }
}

export default mutations
