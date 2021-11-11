import { State } from './state'
import { Credentials } from '@/api/interfaces/PBXConfiguration'

const mutations = {
  login (state: State, payload) { state.login = payload },
  password (state: State, payload) { state.password = payload },
  server (state: State, payload) { state.server = payload },
  schema (state: State, payload) { state.schema = payload },
  port (state: State, payload) { state.port = payload },
  display_name (state: State, payload) { state.display_name = payload },

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
