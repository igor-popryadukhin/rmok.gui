import { RootState } from '@/store'
import { FilterStateInterface } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<FilterStateInterface, RootState> = {
  contact_tags (state: FilterStateInterface) { return state.contact_tags },
  statuses (state: FilterStateInterface) { return state.statuses }
}

export default getters
