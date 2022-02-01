import { RootState } from '@/store'
import { ContactsViewMessagesState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsViewMessagesState, RootState> = {
  items_fetching (state) { return state.items_fetching },
  items (state) { return state.items }
}

export default getters
