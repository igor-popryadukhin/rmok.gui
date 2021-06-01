import { RootStateInterface } from '@/store'
import { FilterStateInterface } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<FilterStateInterface, RootStateInterface> = {
  contact_tags (state: FilterStateInterface) { return state.contact_tags },
  statuses (state: FilterStateInterface) { return state.statuses }
}

export default getters
