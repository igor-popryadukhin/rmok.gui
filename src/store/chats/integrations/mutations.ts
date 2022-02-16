import { State } from './state'
import { MutationTree } from 'vuex'


const mutations: MutationTree<State> = {
  fetching (state: State, payload) { state.fetching = payload },
  account_phone (state: State, payload) { state.account_phone = payload },
  api_id (state: State, payload) { state.api_id = payload },
  api_hash (state: State, payload) { state.api_hash = payload },
  messenger (state: State, payload) { state.messenger = payload }
}

export default mutations
