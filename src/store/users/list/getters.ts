import { RootState } from '@/store'
import { UserListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<UserListState, RootState> = {
  filter_query (state: UserListState) { return state.filter_query },
  items (state: UserListState) { return state.items },
  items_total (state: UserListState) { return state.items_total },
  items_per_page (state: UserListState) { return state.items_per_page },
  items_fetching (state: UserListState) { return state.items_fetching }
}

export default getters
