import { State } from './state'
import { MutationTree } from 'vuex'

export const mutations: MutationTree<State> = {
  pickup_timeout (state, payload) { state.pickup_timeout = payload },
  max_calls_number (state, payload) { state.max_calls_number = payload },
  mode (state, payload) { state.mode = payload },
  queue_name (state, payload) { state.queue_name = payload },
  description (state, payload) { state.description = payload },
  project (state, payload) { state.project = payload },
  summary (state, payload) { state.summary = payload },

  fill (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.status = payload.status
    state.mode = payload.mode
    state.queue_name = payload.queue_name
    state.pickup_timeout = payload.pickup_timeout
    state.max_calls_number = payload.max_calls_number
    state.maximum_attempts = payload.maximum_attempts
    state.calls_processing_rules_actions = payload.calls_processing_rules_actions
    state.calls_processing_rules = payload.calls_processing_rules
    state.description = payload.description
    state.project = payload.project
  }
}
