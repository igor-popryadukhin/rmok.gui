import { RootState } from '@/store'
import { ContactsState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsState, RootState> = {
  process_loading (state) { return state.process_loading },
  total (state) { return state.total },
  items (state) { return state.items },
  selected (state) { return state.selected }
}

export default getters
