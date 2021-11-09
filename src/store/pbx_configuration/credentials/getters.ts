import { GetterTree } from 'vuex'
import { State } from './state'
import { RootState } from '@/store'

const getters: GetterTree<State, RootState> = {
  login (state) { return state.login },
  password (state) { return state.password },
  port (state) { return state.port },
  server (state) { return state.server },
  schema (state) { return state.schema },
  display_name (state) { return state.display_name }
}

export default getters
