import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { State } from './state';

export const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id; },
  name (state: State) { return state.name; },
  status (state: State) { return state.status; },
  mode (state: State) { return state.mode; },
  queue_name (state: State) { return state.queue_name; },
  pickup_timeout (state: State) { return state.pickup_timeout; },
  max_calls_number (state: State) { return state.max_calls_number; },
  maximum_attempts (state: State) { return state.maximum_attempts; },
  calls_processing_rules_actions (state: State) { return state.calls_processing_rules_actions; },
  calls_processing_rules (state: State) { return state.calls_processing_rules; },
  project (state: State) { return state.project; },
  summary (state: State) { return state.summary; }
};
