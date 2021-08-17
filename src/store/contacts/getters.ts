import { RootState } from '@/store'
import { ContactsState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsState, RootState> = {
  process_loading (state: ContactsState) { return state.process_loading },
  per_page (state: ContactsState) { return state.per_page },
  total (state: ContactsState) { return state.total },
  items (state: ContactsState) { return state.items },
  selected (state: ContactsState) { return state.selected }
}

export default getters
