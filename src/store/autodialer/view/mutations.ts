import { State } from './state'
import { MutationTree } from 'vuex'

export const mutations: MutationTree<State> = {
  pickup_timeout (state, payload) { state.pickup_timeout = payload },
  max_calls_number (state, payload) { state.max_calls_number = payload },
  mode (state, payload) { state.mode = payload },
  queue_name (state, payload) { state.queue_name = payload },
  description (state, payload) { state.description = payload },

  fill (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.status = payload.status
    state.mode = payload.mode
    state.queue_name = payload.queue_name
    state.pickup_timeout = payload.pickup_timeout
    state.max_calls_number = payload.max_calls_number
    state.maximum_attempts = payload.maximum_attempts
    state.repeat_calls_settings_available_actions = payload.repeat_calls_settings_available_actions
    state.repeat_calls_settings = payload.repeat_calls_settings
    state.description = payload.description
  }
}
