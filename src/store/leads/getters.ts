import { RootState } from '@/store'
import { LeadsState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<LeadsState, RootState> = {
  items (state: LeadsState) { return state.items },
  items_total (state: LeadsState) { return state.items_total },
  items_fetching (state: LeadsState) { return state.items_fetching }
}

export default getters
