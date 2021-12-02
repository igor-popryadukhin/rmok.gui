import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  dialog_visible (state: State) { return state.dialog_visible },
  field_first_name (state: State) { return state.field_first_name },
  field_last_name (state: State) { return state.field_last_name },
  field_middle_name (state: State) { return state.field_middle_name }
}

export default getters
