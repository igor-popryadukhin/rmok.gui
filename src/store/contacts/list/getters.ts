import { RootState } from '@/store'
import { ContactListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactListState, RootState> = {
  loading (state: ContactListState) { return state?.loading || false },
  per_page (state: ContactListState) { return state.per_page },
  items (state: ContactListState) { return state?.items || [] },
  items_total (state: ContactListState) { return state?.items_total },
  items_selected (state: ContactListState) { return state.items_selected }
}

export default getters
