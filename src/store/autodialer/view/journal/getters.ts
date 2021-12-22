import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  filter_originator (state: State) { return state.filter_originator },
  filter_offset (state: State) { return state.filter_offset },
  filter (state: State) {
    const obj: Record<string, string|number> = {
      offset: state.filter_offset,
      count: state.items_per_page
    }

    if (state.filter_originator > 0) {
      obj.originator_id = state.filter_originator
    }

    return obj
  },

  items_per_page (state: State) { return state.items_per_page },
  items_count (state: State) { return state.items_count },
  items (state: State) { return state.items }
}

export default getters
