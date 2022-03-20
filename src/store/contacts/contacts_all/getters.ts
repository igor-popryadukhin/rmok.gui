import { RootState } from '@/store'
import { ContactsListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsListState, RootState> = {
  error (state: ContactsListState) { return state?.error || false },
  error_text (state: ContactsListState) { return state?.error_text },
  loading (state: ContactsListState) { return state?.loading || false },
  per_page (state: ContactsListState) { return state.per_page },
  items (state: ContactsListState) { return state?.items || [] },
  items_total (state: ContactsListState) { return state?.items_total },
  items_selected (state: ContactsListState) { return state.items_selected }
}

export default getters
