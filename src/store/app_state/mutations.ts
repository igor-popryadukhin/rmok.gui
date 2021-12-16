import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  dialer_connected (state, payload) { state.dialer_connected = payload },
  dialer_registered (state, payload) { state.dialer_registered = payload },
  dialer_state (state, payload) { state.dialer_state = payload },
  page (state, payload) { state.page = payload }
}

export default mutations
