import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  status (state: State) { return state.status },
  mode (state: State) { return state.mode },
  call_back_in_minutes (state: State) { return state.call_back_in_minutes },
  count_of_call_lines (state: State) { return state.count_of_call_lines },
  maximum_attempts (state: State) { return state.maximum_attempts },
  repeat_calls_settings_available_actions (state: State) { return state.repeat_calls_settings_available_actions },
  repeat_calls_settings (state: State) { return state.repeat_calls_settings }
}
