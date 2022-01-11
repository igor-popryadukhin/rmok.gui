import { RootState } from '@/store'
import { UserListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<UserListState, RootState> = {
  per_page (state: UserListState) { return state.per_page },
  total (state: UserListState) { return state.total },
  items (state: UserListState) { return state.items },
  items_fetching (state: UserListState) { return state.items_fetching }
}

export default getters
