import { UserListState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<UserListState> = {
  total (state: UserListState, payload) { state.total = payload },
  items (state: UserListState, payload) { state.items = payload },
  items_fetching (state: UserListState, payload) { state.items_fetching = payload }
}

export default mutations
