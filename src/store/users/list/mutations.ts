import { UserListState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<UserListState> = {
  filter_query (state: UserListState, payload) { state.filter_query = payload },
  items (state: UserListState, payload) { state.items = payload },
  items_per_page (state: UserListState, payload) { state.items_per_page = payload },
  items_total (state: UserListState, payload) { state.items_total = payload },
  items_fetching (state: UserListState, payload) { state.items_fetching = payload }
}

export default mutations
