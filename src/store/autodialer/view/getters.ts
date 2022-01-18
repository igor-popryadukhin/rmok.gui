import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  status (state: State) { return state.status },
  mode (state: State) { return state.mode },
  queue_name (state: State) { return state.queue_name },
  pickup_timeout (state: State) { return state.pickup_timeout },
  max_calls_number (state: State) { return state.max_calls_number },
  maximum_attempts (state: State) { return state.maximum_attempts },
  repeat_calls_settings_available_actions (state: State) { return state.repeat_calls_settings_available_actions },
  repeat_calls_settings (state: State) { return state.repeat_calls_settings },
  project (state: State) { return state.project },
  summary (state: State) { return state.summary }
}
