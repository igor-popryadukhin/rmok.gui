import { RootState } from '@/store'
import { ContactsViewTasksState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsViewTasksState, RootState> = {
  items_fetching (state) { return state.items_fetching },
  items_count (state) { return state.items_count },
  items (state) { return state.items }
}

export default getters
